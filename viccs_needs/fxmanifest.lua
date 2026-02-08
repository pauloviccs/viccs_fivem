fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'viccs_needs'
description 'SimLife Needs & Wants System - The Sims 4 inspired character brain'
version '1.0.0'
author 'VICCS'
repository 'https://github.com/viccs/simlife-needs'

-- Dependencies
dependencies {
    'ox_lib',
    'ox_target',
    'oxmysql',
    'qbx_core'
}

-- Shared scripts (loaded first)
shared_scripts {
    '@ox_lib/init.lua',
    'config.lua',
    'shared/*.lua'
}

-- Client scripts
client_scripts {
    'client/main.lua',
    'client/decay.lua',
    'client/hud.lua',
    'client/interactions.lua'
}

-- Server scripts
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/database.lua',
    'server/wants.lua'
}

-- NUI
ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/assets/*.js',
    'web/dist/assets/*.css',
    'locales/*.json'
}

-- Provide compatibility
provide 'qb-hud'
