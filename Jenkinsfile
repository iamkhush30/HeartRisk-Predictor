pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/iamkhush30/HeartRisk-Predictor'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ml-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 5000:5000 ml-app'
            }
        }
    }
}
