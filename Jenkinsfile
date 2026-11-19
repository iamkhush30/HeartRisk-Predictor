pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = 'host.docker.internal:8082'
        NEXUS_CRED_ID  = 'nexus-credentials'
        DOCKER_HOST    = 'tcp://localhost:2375'
        PATH = "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Python311;C:\\Program Files\\Python311\\Scripts;${env.PATH}"
        AWS_DEFAULT_REGION = 'ap-south-1'    
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
        stage('Push to AWS ECR') {
            options { timeout(time: 90, unit: 'MINUTES') }
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-jenkins-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    bat '''
                    for /f %%i in ('aws sts get-caller-identity --query Account --output text') do set ACCOUNT_ID=%%i
                    set ECR=%ACCOUNT_ID%.dkr.ecr.%AWS_DEFAULT_REGION%.amazonaws.com
                    aws ecr get-login-password --region %AWS_DEFAULT_REGION% | docker login --username AWS --password-stdin %ECR%
                    if errorlevel 1 exit /b 1
                    docker tag ml-app %ECR%/ml-app:%BUILD_NUMBER%
                    docker tag ml-app %ECR%/ml-app:latest
                    docker push %ECR%/ml-app:%BUILD_NUMBER%
                    if errorlevel 1 exit /b 1
                    docker push %ECR%/ml-app:latest
                    if errorlevel 1 exit /b 1
                    docker rmi %ECR%/ml-app:%BUILD_NUMBER%
                    docker rmi %ECR%/ml-app:latest
                    docker logout %ECR%
                    '''
                }
            }
        }

        stage('Remove Older') {
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
