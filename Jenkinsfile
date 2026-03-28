pipeline {
    // This tells Jenkins it can run on any available worker node
    agent any 

    environment {
        // Useful to let scripts know they are running in an automated environment
        CI = 'true'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                // Pulls the latest code from your Git repository (GitHub, GitLab, etc.)
                checkout scm
            }
        }

        stage('2. Spin Up Environment (Docker)') {
            steps {
                echo 'Starting Database, Backend, and Frontend containers...'
                
                dir('p2m_ecommerce-main') {
                    
                    // 1. Generate the .env file on the fly for Docker
                    sh '''
                    cat <<EOT > ecommerce/server/.env
GEMINI_API_KEY=AIzaSyAQaYQFCAvVSXJChFm7M-GXi_oRkqbva4o
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=RFdn1234?!
DB_NAME=smart_db
DB_PORT=5432
EOT
                    '''
                    
                    // 2. Spin up the containers now that the .env is in place
                    sh 'docker-compose up -d --build'
                }
                
                // 3. Give the containers 10 seconds to fully boot up before moving on
                sh 'sleep 10'
            }
        }

        stage('3. Install Playwright Dependencies') {
            steps {
                // Notice we are targeting the specific frontend folder here
                dir('p2m_ecommerce-main/ecommerce/frontend') {
                    echo 'Installing NPM packages and Playwright browsers...'
                    sh 'npm install'
                    // The --with-deps flag is crucial here; it installs the Linux browsers Playwright needs!
                    sh 'npx playwright install --with-deps chromium' 
                }
            }
        }

        stage('4. Run Playwright Tests') {
            steps {
                dir('p2m_ecommerce-main/ecommerce/frontend') {
                    echo 'Running E2E tests...'
                    sh 'npx playwright test --project=chromium'
                }
            }
        }
    }

    post {
        always {
            echo 'Tearing down Docker containers to keep the server clean...'
            
            // We must step into the main folder to find docker-compose.yml for the teardown
            dir('p2m_ecommerce-main') {
                sh 'docker-compose down'
            }
            
            // Step into the frontend folder to grab the test report
            dir('p2m_ecommerce-main/ecommerce/frontend') {
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            }
        }
        success {
            echo '✅ Tests passed! Ready for deployment.'
        }
        failure {
            echo '❌ Tests failed. Please check the Playwright report.'
        }
    }
}