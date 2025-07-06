execute if score Tick Tick matches 6000 run function kill
execute if score Tick Tick matches 5900 run tellraw @a {"rawtext":[{"text":"§2§lItems Clearing in 5 seconds"}]}
execute if score Tick Tick matches 6000 run tellraw @a {"rawtext":[{"text":"§2§lItems Clearing in 5 min"}]}
execute if score Tick Tick matches 6000 run scoreboard players set Tick Tick 0