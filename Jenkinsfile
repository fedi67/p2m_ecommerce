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
                
                // 1. Let's print out everything Jenkins sees in the current folder
                // This is a classic DevOps debugging trick!
                sh 'pwd'
                sh 'ls -la'
                
                // 2. Navigate into the folder where your docker-compose.yml ACTUALLY lives
                // (Change this if your Git repo has a different root folder name)
                dir('p2m_ecommerce-main') {
                    sh 'ls -la' // Print the contents of this folder too, just to be sure
                    sh 'docker-compose up -d --build'
                }
                
                sh 'sleep 10'
            }
        }

        stage('3. Install Playwright Dependencies') {
            steps {
                // Navigate into your frontend folder (where your tests live)
                dir('ecommerce/frontend') {
                    echo 'Installing NPM packages and Playwright browsers...'
                    sh 'npm install'
                    // Installs the invisible (headless) browsers Playwright needs
                    sh 'npx playwright install --with-deps chromium' 
                }
            }
        }

        stage('4. Run Playwright Tests') {
            steps {
                dir('ecommerce/frontend') {
                    echo 'Running E2E tests...'
                    // Runs the tests headlessly (without the --ui flag)
                    sh 'npx playwright test'
                }
            }
        }
    }

    // The 'post' block runs AFTER the stages, no matter what happens
    post {
        always {
            echo 'Tearing down Docker containers to keep the server clean...'
            // CRITICAL: Shut down the containers even if the test fails!
            sh 'docker-compose down'
            
            // Saves the Playwright HTML report so you can view it inside the Jenkins dashboard
            dir('ecommerce/frontend') {
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