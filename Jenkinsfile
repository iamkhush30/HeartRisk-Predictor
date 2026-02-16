pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t ml-app .'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 8501:8501 --name ml-container ml-app'
            }
        }
    }
}
