import unittest
import os
import sys
import pdb
from selenium.common.exceptions import NoSuchElementException
from random import randint
from appium import webdriver
from time import sleep
from settings.settings import *
from common.helper import *
from common.processes import *

class SimpleLogin(unittest.TestCase):
    def test_login(self):
        try:
            tap_by_css('.saved-login')
        except NoSuchElementException:
            print 'skipping saved login'
        try:
            tap_by_css('.pin-pad > div:nth-child(7) > div:nth-child(1)')
        except NoSuchElementException:
            print 'skipping pin pad'
        text_by_id('username', 'testlogin')
        text_by_id('password', 'winding skater rio arrives juicy')
        tap_by_css('.btn-safe')
        assert wait_find_by_id('vscroll').is_displayed()
    def test_logout(self):
        tap_by_id('sidemenu-toggle')
        tap_by_css('.sidebar-menu > :nth-child(3) > li:nth-child(1)')
        assert wait_find_by_id('username').is_displayed()

