pipeline {
    agent any

    environment {
        NEXUS_REGISTRY = 'localhost:8081'
        NEXUS_REPO     = 'nexus-docker-repo'
        NEXUS_CRED_ID  = 'nexus-credentials'   // Jenkins Credentials
        PATH = "C:\\Users\\Admin\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;C:\\Program Files\\Python311;C:\\Program Files\\Python311\\Scripts;${env.PATH}"        
    }

    stage('Diagnose') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    bat '''
                    @echo off
                    echo ===== 0. JENKINSFILE VERSION MARKER: v-diag-1 =====
                    echo ===== 1. WHO RUNS JENKINS =====
                    whoami
                    sc qc Jenkins | findstr /i "SERVICE_START_NAME"
                    echo ===== 2. PATH SEEN BY THIS BUILD =====
                    echo %PATH%
                    echo ===== 3. DOES DOCKER.EXE EXIST AND CAN THIS USER SEE IT =====
                    dir "%DOCKER_BIN%\\docker.exe"
                    echo exit code: %errorlevel%
                    echo ===== 4. where docker =====
                    where docker
                    echo exit code: %errorlevel%
                    echo ===== 5. docker client version =====
                    "%DOCKER_BIN%\\docker.exe" --version
                    echo exit code: %errorlevel%
                    echo ===== 6. docker client+server version =====
                    "%DOCKER_BIN%\\docker.exe" version
                    echo exit code: %errorlevel%
                    echo ===== 7. docker context and host =====
                    "%DOCKER_BIN%\\docker.exe" context ls
                    echo DOCKER_HOST=%DOCKER_HOST%
                    echo ===== 8. docker engine pipes present =====
                    dir \\\\.\\pipe\\ 2>&1 | findstr /i docker
                    echo ===== 9. Docker processes and service =====
                    tasklist | findstr /i docker
                    sc query com.docker.service
                    echo ===== 10. docker info =====
                    "%DOCKER_BIN%\\docker.exe" info
                    echo exit code: %errorlevel%
                    echo ===== 11. Docker daemon.json (insecure registries) =====
                    type "C:\\Users\\Admin\\.docker\\daemon.json"
                    echo ===== 12. Nexus reachable? (8081 = UI, 8082 = Docker repo) =====
                    curl -s -o NUL -w "8081 http code: %%{http_code}\\n" http://localhost:8081
                    curl -s -o NUL -w "8082 http code: %%{http_code}\\n" http://localhost:8082/v2/
                    echo ===== 13. Python =====
                    "%PY_HOME%\\python.exe" --version
                    if exist venv\\Scripts\\python.exe (venv\\Scripts\\python -m pytest --version) else (echo NO VENV IN WORKSPACE)
                    echo ===== 14. Workspace files =====
                    dir /b
                    echo ===== 15. Dockerfile present? =====
                    if exist Dockerfile (echo Dockerfile FOUND) else (echo Dockerfile MISSING)
                    echo ===== END OF DIAGNOSIS =====
                    exit /b 0
                    '''
                }
            }
        }
}
}

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


