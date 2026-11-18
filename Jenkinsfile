pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = 'host.docker.internal:8082'
        NEXUS_CRED_ID  = 'nexus-credentials'
        DOCKER_HOST    = 'tcp://localhost:2375'
        PATH = "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Python311;C:\\Program Files\\Python311\\Scripts;${env.PATH}"
    }

    stages {

        stage('Run Unit & Schema Tests') {
            options { timeout(time: 30, unit: 'MINUTES') }
            steps {
                bat '''
                if not exist venv "C:\\Program Files\\Python311\\python.exe" -m venv venv
                venv\\Scripts\\python -m pip install --default-timeout=300 --retries 10 -r requirements.txt pytest
                if errorlevel 1 exit /b 1
                venv\\Scripts\\python -m pytest test_app.py -v
                '''
            }
        }

        stage('Build Docker Image') {
            options { timeout(time: 40, unit: 'MINUTES') }
            steps {
                bat 'docker build -t ml-app .'
            }
        }

        stage('Push to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${env.NEXUS_CRED_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    bat '''
                    echo %NEXUS_PASS%| docker login -u %NEXUS_USER% --password-stdin %NEXUS_REGISTRY%
                    if errorlevel 1 exit /b 1
                    docker tag ml-app %NEXUS_REGISTRY%/ml-app:%BUILD_NUMBER%
                    docker tag ml-app %NEXUS_REGISTRY%/ml-app:latest
                    docker push %NEXUS_REGISTRY%/ml-app:%BUILD_NUMBER%
                    if errorlevel 1 exit /b 1
                    docker push %NEXUS_REGISTRY%/ml-app:latest
                    if errorlevel 1 exit /b 1
                    docker rmi %NEXUS_REGISTRY%/ml-app:%BUILD_NUMBER%
                    docker rmi %NEXUS_REGISTRY%/ml-app:latest
                    docker logout %NEXUS_REGISTRY%
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                docker rm -f ml-container 2>nul
                docker run -d -p 5000:5000 --name ml-container ml-app
                '''
            }
        }
    }

    post {
        always {
            bat 'docker image prune -f'
        }
    }
}
