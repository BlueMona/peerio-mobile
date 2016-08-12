from common.helper import *

def navigateToSetPin():
    navigateToStart()
    tap_by_id('sidemenu-toggle')
    sleep(1)
    # navigate to set passcode
    assert tap_by_css('.sidebar-menu ._passcode')
    sleep(1)
    removeAlerts()

def navigateToStart():
    for i in xrange(10):
        if not tap_by_id('global-back'):
            break
        sleep(1)

def navigateToLogout():
    # make sure we're at the start page
    navigateToStart()
    assert tap_by_css('.sidebar-menu ._logout')
    assert wait_find_by_id('username')

def navigateToPurchase():
    # make sure we're at the start page
    navigateToStart()
    assert tap_by_css('.sidebar-menu ._purchase')
    assert wait_find_by_css('._purchaseContent')

def removeAlerts(accept=False,selector='.modal'):
    el = find_by_css(selector)
    while el != None:
        if accept:
            tap_by_css(find_by_css('.modal .btn-safe'))
        else:
            tap_by_css(find_by_css('.modal .btn-danger'))
        sleep(1)
        el = find_by_css(selector)
