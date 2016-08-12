import unittest
import os
from time import sleep
from settings.settings import *
from common.helper import *
from common.processes import *
from common.platforms import *

def start_platform(platform, extra):
    if not launchPlatform(platform):
        print "cannot find the platform %s" % platform
        exit()
    connect(extra)

starter = lambda extra: start_platform('browser', extra)
connect()
# starter({})
# t = AppleAdvertisement()
# t = LocaleTest()
# t.test_01_locale_start()
