# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
# 
Vagrant.configure("2") do |config|
  config.vm.box = "gusztavvargadr/windows-server-2019-standard-core"

  config.vm.communicator = "winrm"

  config.vm.provider "virtualbox" do |vb|
    vb.gui = false
    vb.memory = 3072
    vb.cpus = 2
  end

  config.vm.provision "shell", name: "Install Node.js", inline: <<-SHELL
    $ProgressPreference = 'SilentlyContinue'

    Invoke-WebRequest `
    https://nodejs.org/dist/v24.14.0/node-v24.14.0-x64.msi `
    -OutFile C:\\node.msi

    Start-Process msiexec.exe -ArgumentList "/i C:\\node.msi /quiet /norestart" -Wait
    $env:path = "$env:path;C:\Program Files\nodejs"
  SHELL

  # Expose port 9229 to allow debugging
  config.vm.network :forwarded_port, guest: 9229, host: 9229

  config.ssh.shell = "powershell -NoProfile -ExecutionPolicy Bypass"
end
