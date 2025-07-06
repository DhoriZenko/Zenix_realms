execute as @p[tag=starter] run tellraw @s {"rawtext":[{"text":"§4 YOU ALREADY CLAIMED THE STARTER!"}]}
execute as @p[tag=starter] run playsound note.creeper @s
give @p[tag=!starter] minecraft:stone_sword 1 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:stone_axe 1 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:cooked_beef 32 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:chainmail_helmet 1 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:chainmail_chestplate 1 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:chainmail_leggings 1 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:chainmail_boots 1 0 {"keep_on_death": {}}
give @p[tag=!starter] minecraft:bed 1 0 {"keep_on_death": {}}
give @p[tag=!starter] gf_wu:warps 1 0 {"keep_on_death": {}}
give @p[tag=!starter] gf_wu:homes 1 0 {"keep_on_death": {}}
tag @p add starter 