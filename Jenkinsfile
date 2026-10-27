pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = 'localhost:8082'       //port
        NEXUS_REPO     = 'nexus-docker-repo'
        NEXUS_CRED_ID  = 'nexus-credentials'   // Jenkins Credentials
    }

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

        stage('Push to Nexus') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    withCredentials([usernamePassword(credentialsId: "${env.NEXUS_CRED_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        bat '''
                        echo [INFO] Logging into Nexus Docker Registry at %NEXUS_REGISTRY%...
                        docker login -u %NEXUS_USER% -p %NEXUS_PASS% %NEXUS_REGISTRY%
                        
                        echo [INFO] Tagging image for Nexus...
                        docker tag ml-app %NEXUS_REGISTRY%/ml-app:%BUILD_NUMBER%
                        docker tag ml-app %NEXUS_REGISTRY%/ml-app:latest
                        
                        echo [INFO] Pushing image to Nexus...
                        docker push %NEXUS_REGISTRY%/ml-app:%BUILD_NUMBER%
                        docker push %NEXUS_REGISTRY%/ml-app:latest
                        
                        docker logout %NEXUS_REGISTRY% || exit 0
                        '''
                    }
                }
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 5000:5000 --name ml-container ml-app'
            }
        }
    }
}
