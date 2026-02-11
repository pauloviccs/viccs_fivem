fx_version 'cerulean'
game 'gta5'
lua54 'yes'

description 'VICCS Phone - Qbox Edition'
version '1.0.0'
author 'VICCS Design'

sql_file 'sql/schema.sql'

shared_scripts {
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua'
}

ui_page 'web/dist/index.html'

files {
    'sql/schema.sql',
    'web/dist/index.html',
    'web/dist/assets/**/*',
    'web/dist/*.js',
    'web/dist/*.css'
}

dependencies {
    'qbx_core',
    'ox_lib',
    'oxmysql',
    'screenshot-basic'
}
