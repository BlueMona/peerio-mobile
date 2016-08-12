import common.testcase
import time
from common.helper import *
import peerio

class LocaleTest(common.testcase.TestCase):
    locales = {
        "en": {
            "login": "Login",
            "signup": ""
        },
        "fr": {
            "login": "Connexion",
            "signup": "Commencer"
        }
    }

    def locale_test(self, l):
        option_by_css("#language-select", l)
        time.sleep(0.5)
        assert get_text_by_css('.btn-safe') == self.locales[l]["login"]

    def test_01_locale_start(self):
        for l in self.locales:
            self.locale_test(l)
        self.locale_test("en")

    def checkPassphraseLocale(self):
        assert value_by_css("#lang") == "fr"

    def test_02_locale_passphrase(self):
        self.restart()
        self.locale_test("fr")
        peerio.signup(self.checkPassphraseLocale)

    def test_03_locale_after_signup(self):
        self.restart()
        self.locale_test("fr")
        peerio.signup()
        wait_find_by_css('._setupWizard')
        assert get_text_by_css('.btn-safe') == self.locales["fr"]["signup"]

