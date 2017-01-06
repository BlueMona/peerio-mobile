import atexit
import sys
import time
import os
import subprocess
import commands
import re

def startAppium():
    atexit.register(killAppium)
    path = ['node_modules/.bin/appium']
    appiumProcess = subprocess.Popen(path,
                                     stdout=subprocess.PIPE)
    while True:
        line = appiumProcess.stdout.readline()
        if line != '':
            print line.strip()
        if "listener started" in line:
            return True

def killAppium():
    os.system("ps -A | grep [a]ppium | awk '{print $1}' | xargs kill -9")

def restartAppium():
    killAppium()
    startAppium()

def startChromedriver():
    atexit.register(killChromedriver)
    chromedriverPath = os.path.join(os.path.dirname(__file__),
                                    '../../tools/chromedriver')
    chromedriverProcess = subprocess.Popen([chromedriverPath],
                                           stdout=subprocess.PIPE)
    while True:
        line = chromedriverProcess.stdout.readline()
        if line != '':
            print line.strip()
        if "are allowed" in line:
            time.sleep(2)
            return True

def killChromedriver():
    os.system("ps -A | grep [c]hromedriver | awk '{print $1}' | xargs kill -9")

def restartChromedriver():
    killChromedriver()
    startChromedriver()

def startBrowserAutomation():
    # do not kill browser automation server on exit so that there are
    # no noisy messages about not being able
    # to connect to automation socket in browser
    print "processes.py: waiting for browser automation server"
    automationServerPath = os.path.join(os.path.dirname(__file__),
                                        '../browserautomationserver.py')
    os.system("python " + automationServerPath + "&")
    return True

def killBrowserAutomation():
    os.system("""ps -A | grep [b]rowserautomationserver.py |
              awk '{print $1}' | xargs kill -9""")

def restartBrowserAutomation():
    killBrowserAutomation()
    startBrowserAutomation()

def startIosDebugProxy():
    atexit.register(killIosDebugProxy)
    print "waiting for ios debug proxy to start"
    udid = getIPhoneDeviceID()
    if not udid:
        raise Exception("No iOS devices connected")
    os.system("tools/ios_webkit_debug_proxy -c %s:27753 &" % udid)
    return True

def killIosDebugProxy():
    os.system("""ps -A | grep [i]os_webkit_debug_proxy |
              awk '{print $1}' | xargs kill -9""")

def restartIosDebugProxy():
    killIosDebugProxy()
    startIosDebugProxy()

def getIPhoneDeviceID():
    res = commands.getstatusoutput("ideviceinfo | grep UniqueDeviceID")
    if len(res) < 2:
        return False
    res = res[1]
    res = res.split(': ')
    if len(res) < 2:
        return False
    return res[1]

def getAndroidDevices():
    res = commands.getstatusoutput("adb devices | grep device")
    if len(res) < 2:
        raise Exception("adb devices does not work")
    res = res[1].split('\n')
    if len(res) < 2:
        raise Exception("adb devices not found")
    del res[0]
    ret = []
    regex = re.compile(r'\d+\.\d+\.\d+\.\d+:\d+')
    for i in res:
        name = i.split()[0]
        atype = "physical"
        if regex.match(name):
            atype = "genymotion"
        ret.append( { "name": name, "type": atype } )
    return ret

def getFirstPhysicalAndroidDeviceID():
    try:
        return next(x for x in getAndroidDevices() if x["type"] == "physical")
    except StopIteration:
        raise Exception("No physical Android devices connected")

def getFirstGenyMotionAndroidDeviceID():
    try:
        return next(x for x in getAndroidDevices() if x["type"] == "genymotion")
    except StopIteration:
        raise Exception("No GenyMotion Android devices connected")

def enableSimulatorTouchID():
    path = os.path.join(os.path.dirname(__file__),
                        '../../tools/enable-simulator-touchid.app')
    res = commands.getstatusoutput("open %s" % path)
    print "processes.py: touchid result %s" % res
