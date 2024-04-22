# Puppeteer Signin on a Headless Server
Sign into services and save sessions with cookies using Puppeteer on a headless server.

You will need a linux-based computer, such as Ubuntu, and a headless Debian-based cloud server of your choice (GCP, Digital Ocean, Oracle, etc). You will be enabling X11 forwarding so that you can see what you are doing. After sign in, you will be able to create scripts with the headless option enabled.

On your cloud server, first, update and upgrade everything:
```console
sudo apt update -y && sudo apt upgrade -y
```

Enable X11 forwarding:

```console
sudo nano /etc/ssh/sshd_config
```
Uncomment (remove the hashtags):
```console
X11Forwarding yes
X11DisplayOffset 10
```
Press `ctrl + o` and then `enter` to save and `ctrl + x` to exit nano.

Create `.Xauthority` file:

```console
xauth add $(xauth -f ~/.Xauthority list|tail -1)
```
Set proper environment variables:
```console
nano ~/.bashrc
```
Paste at the bottom:
```console
export DISPLAY=:10
export XAUTHORITY=~/.Xauthority
```
Save and close, then run:
```console
source ~/.bashrc
```
Install nodejs, npm and Chromium:
```console
sudo apt install nodejs npm chromium-browser
```
Update node with nvm node manager (Node Version Manager):
*Note that as of this writing, the latest version is 0.39.7. You can find the latest version [here](https://github.com/nvm-sh/nvm/releases).*
```console
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
Exit from your cloud server. On your **local** (**not** cloud) Debian-based computer:
```console
nano ~/.ssh/config
```
You now need to either add your `Host`, or amend your Host with `ForwardX11` and `ForwardX11Trusted`. I called my host (the cloud server) `puppeteer`. You can call it what you want. Substitute `123.456.78.900` with your cloud server's public IP address. `IdentityFile` is wherever your private key is located. I called my private key `puppeteer`. Change `myusername` to your own username, and change the path and `mypuppeteerkey` to whatever you named your key:

*Note that when you are done with X11 forwarding and no longer need need to see a browser in your cloud server, disable `ForwardX11` and `ForwardX11Trusted` by putting hash tags in front of them.*
```console
Host puppeteer
        Hostname 123.456.78.900
        IdentityFile ~/.ssh/mypuppeteerkey
        User myusername
        Port 22
        ForwardX11 yes
        ForwardX11Trusted yes
```
Now log back into your cloud server with (assuming you named your `Host` `puppeteer`):
```console
ssh -v puppeteer
```
Install the new nvm version and set it to use it:
```console
nvm install 14
nvm use 14
```
Install the required Puppeteer dependencies:
```console
sudo apt-get install libx11-xcb1 libxcomposite1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0
```

Clone this repo from your home folder (you can rename the `puppeteersigninheadless` directory to whatever you want your project name to be, but be sure to also rename it in the `sign-in.js` script as well):

```console
cd
git clone https://github.com/threehappypenguins/puppeteersigninheadless.git
cd puppeteersigninheadless
```

*Press enter for default everything*
```console
npm init
```
```console
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth
```

Now you can run the script from the `puppeteersigninheadless` directory:
```console
node signin-script.js
```

You may need to wait for several seconds, depending on the processing speed of your server. A Chromium browser should pop up. You can the sign into whatever service(s) you need, and then close.

Create a new script for whatever your purposes are, but make sure to include cookies in the script. See the section `// Set the cookies as extra HTTP headers` in example.js.
