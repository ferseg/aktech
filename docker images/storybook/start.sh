# author: rodrigo nunez
# last update: 07-14-2022

echo "running start.sh for storybook"

DIR="/home/project"

# check if this is an empty folder or not
if [ "$(ls -A $DIR)" ]; then
    echo "project with storybook already setup"
    cd /home/project
    npm run storybook
    if [ $? -eq 0 ]; then 
        echo "Storybook ok" 
    else 
        echo "Storybook is not present in the project, installing storybook"
        npx storybook init
        npm run storybook
    fi
else
    echo "starting with a new base project"
    cd /home/baseproject
    cp . -R /home/project
    cd /home/project
    npx storybook init
    npm run storybook
fi
