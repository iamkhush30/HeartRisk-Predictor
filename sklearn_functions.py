import numpy as np

class DecisionTree:
    def __init__(self, max_depth=None, min_samples_split=2):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.tree = None
        self.all_classes = None

    def fit(self, X, y):
        self.all_classes = np.unique(y)
        self.tree = self._build_tree(X, y, depth=0)

    def _gini(self, y):
        m = len(y)
        if m == 0: return 0
        counts = [np.sum(y == c) for c in self.all_classes]
        return 1.0 - sum((count / m) ** 2 for count in counts)

    def _best_split(self, X, y):
        m, n = X.shape
        if m <= self.min_samples_split:
            return None, None

        best_gini = self._gini(y)
        best_idx, best_thr = None, None

        for idx in range(n):
            # Sort only once per feature
            sort_indices = np.argsort(X[:, idx])
            X_sorted, y_sorted = X[sort_indices, idx], y[sort_indices]
            
            for i in range(1, m):
                # Skip duplicate values
                if X_sorted[i] == X_sorted[i-1]:
                    continue
                
                # Split and calculate Gini
                y_left, y_right = y_sorted[:i], y_sorted[i:]
                gini_left, gini_right = self._gini(y_left), self._gini(y_right)
                weighted_gini = (i * gini_left + (m - i) * gini_right) / m

                if weighted_gini < best_gini:
                    best_gini = weighted_gini
                    best_idx = idx
                    best_thr = (X_sorted[i] + X_sorted[i-1]) / 2

        return best_idx, best_thr

    def _build_tree(self, X, y, depth):
        num_samples_per_class = [np.sum(y == c) for c in self.all_classes]
        predicted_class = self.all_classes[np.argmax(num_samples_per_class)]
        node = {"predicted_class": predicted_class}

        if depth < (self.max_depth or np.inf) and len(np.unique(y)) > 1:
            idx, thr = self._best_split(X, y)
            if idx is not None:
                indices_left = X[:, idx] < thr
                node["feature_index"] = idx
                node["threshold"] = thr
                node["left"] = self._build_tree(X[indices_left], y[indices_left], depth + 1)
                node["right"] = self._build_tree(X[~indices_left], y[~indices_left], depth + 1)
        return node

    def predict(self, X):
        return np.array([self._traverse(x, self.tree) for x in X])

    def _traverse(self, x, node):
        if "feature_index" not in node:
            return node["predicted_class"]
        if x[node["feature_index"]] < node["threshold"]:
            return self._traverse(x, node["left"])
        return self._traverse(x, node["right"])

class RandomForestClassifier:
    def __init__(self, n_estimators=10, max_depth=None, min_samples_split=2, max_features=None, random_state=None):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.max_features = max_features
        self.random_state = random_state
        self.trees = []
        self.rng = np.random.default_rng(random_state)

    def fit(self, X, y):
        self.trees = []
        n_samples, n_features = X.shape
        max_feat = self.max_features or int(np.sqrt(n_features))

        for _ in range(self.n_estimators):
            # Bootstrap sampling
            indices = self.rng.choice(n_samples, n_samples, replace=True)
            # Feature sampling
            features = self.rng.choice(n_features, max_feat, replace=False)
            
            tree = DecisionTree(max_depth=self.max_depth, min_samples_split=self.min_samples_split)
            tree.fit(X[indices][:, features], y[indices])
            self.trees.append((tree, features))

    def predict(self, X):
        # Gather predictions from all trees
        tree_preds = np.array([tree.predict(X[:, feats]) for tree, feats in self.trees])
        # Majority vote per sample
        return np.array([np.bincount(tree_preds[:, i]).argmax() for i in range(X.shape[0])])
    
    def predict_proba(self, X):
        tree_preds = np.array([tree.predict(X[:, feats]) for tree, feats in self.trees])
        proba = np.zeros((X.shape[0], len(np.unique(tree_preds))))
        for i in range(X.shape[0]):
            counts = np.bincount(tree_preds[:, i], minlength=proba.shape[1])
            proba[i] = counts / self.n_estimators
        return proba

class StandardScaler:
    def __init__(self):
        self.mean_ = None
        self.scale_ = None

    def fit(self, X):
        self.mean_ = np.mean(X, axis=0)
        self.scale_ = np.std(X, axis=0)
        self.scale_[self.scale_ == 0] = 1.0 
        return self

    def transform(self, X):
        return (X - self.mean_) / self.scale_

    def fit_transform(self, X):
        return self.fit(X).transform(X)
    
def train_test_split(X, y, test_size=0.2, shuffle=True, random_state=None):
    rng = np.random.default_rng(random_state)
    indices = np.arange(X.shape[0])
    if shuffle:
        rng.shuffle(indices)
    
    split_idx = int(X.shape[0] * (1 - test_size))
    train_idx, test_idx = indices[:split_idx], indices[split_idx:]
    return X[train_idx], X[test_idx], y[train_idx], y[test_idx]

def accuracy_score(y_true, y_pred):
    return np.mean(np.array(y_true) == np.array(y_pred))

def precision_score(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    tp = np.sum((y_true == 1) & (y_pred == 1))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    return tp / (tp + fp) if (tp + fp) > 0 else 0.0

def recall_score(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    tp = np.sum((y_true == 1) & (y_pred == 1))
    fn = np.sum((y_true == 1) & (y_pred == 0))
    return tp / (tp + fn) if (tp + fn) > 0 else 0.0

def f1_score(y_true, y_pred):
    p, r = precision_score(y_true, y_pred), recall_score(y_true, y_pred)
    return 2 * p * r / (p + r) if (p + r) > 0 else 0.0