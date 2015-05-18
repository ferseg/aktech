Vagrant + Chef

vagrant box at [name] [route or URL]

vagrant box list
vagrant box remove name

+ Init project
vagrant init [box_name] -> generates Vagrantfile
vagrant up -> starts the box and run the provisioning. Generates folder .vagrant
vagrant halt -> closes the VM
vagrant ssh -> user vagrant/pass vagrant  Default port is 2222

+ Chef
Configure servers

3 roles:
 - Chef Server
 - Chef Nodes
 - Chef Workstation

+ Chef Solo
Implemented by Vagrant.
Chef Light -> Executes recipes and roles

In Vagrant file, uncomment: config.vm.provision 'chef_solo'
