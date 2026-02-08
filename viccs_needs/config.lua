--[[
    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║                     SIMLIFE NEEDS & WANTS SYSTEM                         ║
    ║                         Configuration File                                ║
    ╠═══════════════════════════════════════════════════════════════════════════╣
    ║  Inspired by The Sims 4 | By VICCS | Version 1.0.0                       ║
    ╚═══════════════════════════════════════════════════════════════════════════╝
]]

Config = {}

-- ═══════════════════════════════════════════════════════════════════════════
-- NEEDS CONFIGURATION
-- ═══════════════════════════════════════════════════════════════════════════

-- Global Decay Multiplier (0.5 = half speed, 2.0 = double speed)
-- Use this to tune the entire system speed without changing individual values.
Config.GlobalDecayMultiplier = 10.0

Config.Needs = {
    hunger = {
        label = 'Fome',
        icon = 'utensils',
        color = { healthy = '#4ade80', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.5,        -- Base: 0.5% per minute (approx 3.3h to empty)
        decayMultipliers = {
            running = 1.5,
            working = 1.2,
            sleeping = 0.1      -- Almost no hunger while sleeping
        },
        criticalThreshold = 20,
        warningThreshold = 40
    },
    
    energy = {
        label = 'Energia',
        icon = 'bolt',
        color = { healthy = '#60a5fa', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.3,        -- Base: 0.3% per minute (approx 5.5h awake)
        decayMultipliers = {
            running = 2.0,
            working = 1.5,
            idle = 0.8,
            driving = 1.1
        },
        criticalThreshold = 15,
        warningThreshold = 35
    },
    
    hygiene = {
        label = 'Higiene',
        icon = 'shower',
        color = { healthy = '#34d399', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.2,        -- Base: 0.2% per minute (approx 8.3h to dirty)
        decayMultipliers = {
            running = 2.5,      -- Sweating makes you dirty fast
            working = 1.5,
            gym = 3.0           -- Exercise (if added later)
        },
        criticalThreshold = 25,
        warningThreshold = 45
    },

    thirst = {
        label = 'Sede',
        icon = 'glass-water',
        color = { healthy = '#60a5fa', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.6,        -- Base: 0.6% per minute (~2.7h)
        decayMultipliers = {
            running = 2.0,
            working = 1.5,
            driving = 1.1
        },
        criticalThreshold = 15,
        warningThreshold = 35
    },
    
    bladder = {
        label = 'Bexiga',
        icon = 'droplet',
        color = { healthy = '#a78bfa', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.6,        -- Base: 0.6% per minute (2.7h)
        decayMultipliers = {
            drinking = 2.5,
            nervous = 1.5
        },
        criticalThreshold = 15,
        warningThreshold = 35
    },
    
    social = {
        label = 'Social',
        icon = 'users',
        color = { healthy = '#fb923c', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.25,       -- Base: 0.25% per minute
        decayMultipliers = {
            alone = 1.2,
            nearPlayers = 0.0   -- Stops decaying near people
        },
        criticalThreshold = 20,
        warningThreshold = 40
    },
    
    fun = {
        label = 'Diversão',
        icon = 'gamepad-2',
        color = { healthy = '#f472b6', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.3,        -- Base: 0.3% per minute
        decayMultipliers = {
            working = 1.8,      -- Work is boring
            idle = 1.0,
            playing = 0.0
        },
        criticalThreshold = 25,
        warningThreshold = 45
    },
    
    comfort = {
        label = 'Conforto',
        icon = 'sofa',
        color = { healthy = '#22d3ee', warning = '#facc15', critical = '#f87171' },
        decayRate = 0.4,        -- Base: 0.4% per minute
        decayMultipliers = {
            standing = 1.5,     -- Standing reduces comfort
            sitting = -0.5,     -- Sitting RESTORES comfort (negative decay)
            sleeping = -1.0     -- Sleeping restores comfort fast
        },
        criticalThreshold = 20,
        warningThreshold = 40
    }
}

-- ═══════════════════════════════════════════════════════════════════════════
-- WANTS SYSTEM
-- ═══════════════════════════════════════════════════════════════════════════

Config.Wants = {
    triggerThreshold = 40,   -- % para começar a gerar wants
    maxActiveWants = 3,       -- Máximo de wants ativos
    expirationTime = 30,      -- Minutos para expirar
    
    -- Catálogo de Wants possíveis
    catalog = {
        -- Relacionados a Fome
        eat_gourmet = {
            label = 'Comer Comida Gourmet',
            description = 'Satisfaça seu paladar refinado',
            icon = 'chef-hat',
            affects = { hunger = 30, fun = 15 },
            triggers = { hunger = { below = 50 } },
            moodBonus = 20
        },
        eat_quick = {
            label = 'Fazer um Lanche',
            description = 'Uma refeição rápida',
            icon = 'sandwich',
            affects = { hunger = 20 },
            triggers = { hunger = { below = 40 } },
            moodBonus = 5
        },
        
        -- Relacionados a Energia
        take_nap = {
            label = 'Tirar uma Soneca',
            description = 'Descansar um pouco',
            icon = 'bed',
            affects = { energy = 25, comfort = 10 },
            triggers = { energy = { below = 40 } },
            moodBonus = 10
        },
        drink_coffee = {
            label = 'Tomar Café',
            description = 'Uma dose de cafeína',
            icon = 'coffee',
            affects = { energy = 15, bladder = -10 },
            triggers = { energy = { below = 50 } },
            moodBonus = 8
        },
        
        -- Relacionados a Social
        chat_with_someone = {
            label = 'Conversar com Alguém',
            description = 'Bater um papo',
            icon = 'message-circle',
            affects = { social = 25, fun = 10 },
            triggers = { social = { below = 45 } },
            moodBonus = 15
        },
        
        -- Relacionados a Diversão
        watch_tv = {
            label = 'Assistir TV',
            description = 'Relaxar vendo algo',
            icon = 'tv',
            affects = { fun = 30, comfort = 10 },
            triggers = { fun = { below = 40 } },
            moodBonus = 12
        },
        play_game = {
            label = 'Jogar Videogame',
            description = 'Se divertir jogando',
            icon = 'gamepad',
            affects = { fun = 40, social = -5, energy = -10 },
            triggers = { fun = { below = 35 } },
            moodBonus = 25
        },
        
        -- Relacionados a Higiene
        take_shower = {
            label = 'Tomar um Banho',
            description = 'Ficar limpo e renovado',
            icon = 'droplets',
            affects = { hygiene = 50, comfort = 20 },
            triggers = { hygiene = { below = 35 } },
            moodBonus = 15
        },
        
        -- Relacionados a Bexiga
        use_bathroom = {
            label = 'Usar o Banheiro',
            description = 'Aliviar a natureza',
            icon = 'toilet',
            affects = { bladder = 100 },
            triggers = { bladder = { below = 25 } },
            moodBonus = 5
        }
    }
}

-- ═══════════════════════════════════════════════════════════════════════════
-- HUD CONFIGURATION
-- ═══════════════════════════════════════════════════════════════════════════

Config.HUD = {
    position = 'bottom-left',
    defaultVisible = true,
    animationDuration = 200,  -- ms
    updateInterval = 1000,    -- ms entre updates visuais
    
    -- Visual style
    style = {
        barType = 'horizontal',  -- 'horizontal' ou 'circular'
        showLabels = false,       -- Mostrar labels de texto
        showValues = false,       -- Mostrar valores numéricos
        opacity = 0.9,
        blur = 8,                 -- px de blur no fundo
        borderRadius = 12         -- px
    },
    
    -- Pulse animation para estados críticos
    criticalPulse = {
        enabled = true,
        duration = 1500,  -- ms
        intensity = 0.3   -- 0-1
    },
    
    -- Health & Armor (Barra de Vida/Colete - Sem decay)
    showHealth = true,
    showArmor = true
}

-- ═══════════════════════════════════════════════════════════════════════════
-- INTERACTABLE PROPS SYSTEM (ox_target)
-- Props do GTA que podem ser usados para suprir necessidades.
-- Consulte: https://forge.plebmasters.de/objects para lista completa de props.
-- ═══════════════════════════════════════════════════════════════════════════

Config.InteractableProps = {
    -- ───────────────────────────────────────────────────────────────────────
    -- BEXIGA (Bladder)
    -- ───────────────────────────────────────────────────────────────────────
    toilets = {
        models = {
            'prop_toilet_01',
            'prop_toilet_02',
            'prop_cs_toilet',
            'prop_ld_toilet_01',
            'v_res_tre_toilet',
            'v_res_msontoilet',
            'prop_toilet_brush_01',
            'apa_mp_h_yacht_toilet_01',
        },
        need = 'bladder',
        fillAmount = 100,
        animation = {
            dict = 'misscarsteal2',
            clip = 'intol_bathroom_idle_01',
            flag = 1
        },
        duration = 8000,
        progressLabel = 'Usando o banheiro...',
        icon = 'fas fa-toilet'
    },
    
    urinals = {
        models = {
            'prop_urinal_01',
            'prop_urinal_02',
            'prop_urinal_03',
            'prop_urinal_04',
            'prop_urinal_05'
        },
        need = 'bladder',
        fillAmount = 100,
        animation = {
            dict = 'misscarsteal2',
            clip = 'intol_bathroom_idle_01',
            flag = 1
        },
        duration = 6000,
        progressLabel = 'Usando o mictório...',
        icon = 'fas fa-toilet',
        maleOnly = true
    },
    
    -- ───────────────────────────────────────────────────────────────────────
    -- HIGIENE (Hygiene)
    -- ───────────────────────────────────────────────────────────────────────
    showers = {
        models = {
            'prop_shower_rack_01',
            'v_res_tre_shower',
            'v_res_msonshower',
            'apa_mp_h_yacht_shower_01'
        },
        need = 'hygiene',
        fillAmount = 100,
        animation = {
            dict = 'mp_arresting',
            clip = 'idle',
            flag = 1
        },
        duration = 15000,
        progressLabel = 'Tomando banho...',
        icon = 'fas fa-shower'
    },
    
    sinks = {
        models = {
            'prop_sink_01',
            'prop_sink_02',
            'prop_sink_03',
            'prop_sink_04',
            'prop_sink_05',
            'prop_sink_06',
            'v_res_tre_sink',
            'v_res_msonsink'
        },
        need = 'hygiene',
        fillAmount = 25,
        animation = {
            dict = 'mp_arresting',
            clip = 'idle',
            flag = 1
        },
        duration = 5000,
        progressLabel = 'Lavando as mãos...',
        icon = 'fas fa-hand-holding-water'
    },
    
    -- ───────────────────────────────────────────────────────────────────────
    -- ENERGIA (Energy) & CONFORTO (Comfort)
    -- ───────────────────────────────────────────────────────────────────────
    beds = {
        models = {
            'p_lestersbed_s',
            'p_mbbed_s',
            'p_v_res_tt_bed_s',
            'v_res_tre_bed1',
            'v_res_msonbed',
            'apa_mp_h_bed_double_08',
            'apa_mp_h_bed_wide_05',
            'hei_heist_bed_double_08',
            'v_res_tt_bed'
        },
        need = 'energy',
        fillAmount = 100,
        animation = {
            dict = 'timetable@tracy@sleep@',
            clip = 'idle_c',
            flag = 1
        },
        duration = 30000,
        progressLabel = 'Descansando...',
        icon = 'fas fa-bed',
        alsoRestores = {
            comfort = 50
        }
    },
    
    couches = {
        models = {
            'prop_couch_01',
            'prop_couch_02',
            'prop_couch_03',
            'prop_couch_04',
            'prop_couch_sm_02',
            'prop_couch_sm_06',
            'v_res_tre_sofa',
            'v_res_msonsofa'
        },
        need = 'comfort',
        fillAmount = 60,
        animation = {
            dict = 'timetable@ron@ig_3_couch',
            clip = 'base',
            flag = 1
        },
        duration = 10000,
        progressLabel = 'Relaxando...',
        icon = 'fas fa-couch',
        alsoRestores = {
            energy = 15
        }
    },
    
    -- ───────────────────────────────────────────────────────────────────────
    -- DIVERSÃO (Fun)
    -- ───────────────────────────────────────────────────────────────────────
    tvs = {
        models = {
            'prop_tv_flat_01',
            'prop_tv_flat_02',
            'prop_tv_flat_03',
            'prop_tv_flat_michael',
            'prop_tv_03',
            'v_res_tre_tv',
            'v_res_msontv'
        },
        need = 'fun',
        fillAmount = 30,
        animation = {
            dict = 'amb@code_human_in_bus_passenger_idles@female@tablet@idle_a',
            clip = 'idle_a',
            flag = 49
        },
        duration = 20000,
        progressLabel = 'Assistindo TV...',
        icon = 'fas fa-tv',
        continuous = true,
        alsoRestores = {
            comfort = 10
        }
    },
    
    arcade_machines = {
        models = {
            'prop_arcade_01',
            'prop_arcade_02',
            'vw_prop_vw_arcade_01a',
            'vw_prop_vw_arcade_02a_alt'
        },
        need = 'fun',
        fillAmount = 50,
        animation = {
            dict = 'amb@prop_human_atm@male@idle_a',
            clip = 'idle_a',
            flag = 49
        },
        duration = 25000,
        progressLabel = 'Jogando arcade...',
        icon = 'fas fa-gamepad'
    },
    
    -- ───────────────────────────────────────────────────────────────────────
    -- FOME (Hunger)
    -- ───────────────────────────────────────────────────────────────────────
    vending_machines = {
        models = {
            'prop_vend_snak_01',
            'prop_vend_snak_01_tu',
            'prop_vend_coffe_01',
            'prop_vend_water_01',
            'prop_vend_soda_01',
            'prop_vend_soda_02'
        },
        need = 'hunger',
        fillAmount = 15,
        animation = {
            dict = 'mini@sprunk',
            clip = 'plyr_buy_drink_pt1',
            flag = 1
        },
        duration = 4000,
        progressLabel = 'Comprando lanche...',
        icon = 'fas fa-cookie',
        requiresMoney = 10
    },
    
    coffee_machines = {
        models = {
            'prop_coffee_mac_02',
            'p_dinechair_01_s'
        },
        need = 'energy',
        fillAmount = 20,
        animation = {
            dict = 'mp_player_intdrink',
            clip = 'loop_bottle',
            flag = 49
        },
        duration = 8000,
        progressLabel = 'Tomando café...',
        icon = 'fas fa-coffee',
        alsoRestores = {
            fun = 5
        },
        alsoDrains = {
            bladder = 15
        }
    }
}

-- ═══════════════════════════════════════════════════════════════════════════
-- INTERACTION SYSTEM SETTINGS
-- ═══════════════════════════════════════════════════════════════════════════

Config.Interactions = {
    targetDistance = 2.5,           -- Distância para ox_target detectar
    cancelKey = 'x',                -- Tecla para cancelar ação
    cooldown = 30,                  -- Cooldown em segundos entre usos
    freezePlayer = true,            -- Bloquear movimento durante ação
    
    screenEffect = {
        enabled = true,
        effect = 'CamPushInScottFranklin'
    },
    
    progressBar = {
        enabled = true,
        position = 'bottom',
        color = '#4ade80'
    }
}

-- ═══════════════════════════════════════════════════════════════════════════
-- PERSISTENCE & TIMING
-- ═══════════════════════════════════════════════════════════════════════════

Config.SaveInterval = 60000         -- ms (1 minuto)
Config.DecayTickInterval = 10000    -- ms (10 segundos)

-- ═══════════════════════════════════════════════════════════════════════════
-- DEBUG
-- ═══════════════════════════════════════════════════════════════════════════

Config.Debug = true                -- Ativar logs de debug
