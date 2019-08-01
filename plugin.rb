# name: discourse-debtcollective-theme
# about: Plugin to bend Discourse to the Debt Collective's aesthetic will
# version: 0.0.1
# authors: Debt Collective team

register_asset 'stylesheets/main.scss'
register_asset 'stylesheets/mobile/main.scss', :mobile

register_asset 'javascripts/helpers/device'

enabled_site_setting :debtcollective_theme_enabled
