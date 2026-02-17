pipeline {
    agent any

    stages {

        stage('Stop & Remove Old Container') {
            steps {
                bat '''
                docker stop ml-container || exit 0
                docker rm ml-container || exit 0
                '''
            }
        }

        stage('Remove Old Image') {
            steps {
                bat '''
                docker rmi ml-app || exit 0
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build --no-cache -t ml-app .'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 5000:5000 --name ml-container ml-app'
            }
        }
    }
}
