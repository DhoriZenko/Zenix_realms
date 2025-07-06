import { world, system } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";

// --- Form Handling Functions ---

function main(player) {
    console.log(`[Zenix Script] Main menu opened for player: ${player.name}`);
    const form = new ActionFormData()
        .title("zenix")
        .body("welcome to Zenix Realms!")
        .button("Rules", "textures/items/emerald")
        .button("Info\n Help/info", "textures/items/book_normal")
        .button("discord", "textures/items/ender_pearl")
        .button("Starter Kit!", "textures/items/bread");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] Main form was dismissed by player.");
            return;
        }

        console.log(`[Zenix Script] Main form selection: ${r.selection}`);
        if (r.selection === 0) Rules(player);
        else if (r.selection === 1) Info(player);
        else if (r.selection === 2) Discord(player);
        else if (r.selection === 3) { // Starter Kit!
            console.log("[Zenix Script] Starter Kit button pressed.");
            
            const hasStarterTag = player.hasTag("starter");

            if (hasStarterTag) {
                player.sendMessage("§4 YOU ALREADY CLAIMED THE STARTER!");
                // Use player.runCommandAsync for playsound if it works, or fallback to world if needed
                player.runCommandAsync("playsound note.creeper @s")
                    .catch(error => {
                        console.error(`[Zenix Script] Error playing sound for denied claim for ${player.name}: ${error}`);
                    });
            } else {
                // --- Message changed as requested ---
                player.sendMessage("§aRedeemed starter kit!");
                // --- End of Message change ---

                const playerId = player.id; // Get player ID before async operations

                console.log(`[Zenix Script] Attempting to give kit to ${player.name} (ID: ${playerId}).`);

                system.run(async () => {
                    // Re-fetch the player object to ensure it's valid if there's any delay
                    const currentPlayer = world.getPlayers().find(p => p.id === playerId);

                    if (!currentPlayer) {
                        console.error(`[Zenix Script] Could not find player with ID ${playerId} to give kit. Aborting.`);
                        player.sendMessage(`§cError: Player not found for kit delivery.`);
                        return;
                    }

                    // Get player's exact name for selector in commands, wrapped in quotes for robustness
                    const playerName = `"${currentPlayer.name}"`; 

                    console.log(`[Zenix Script] Found current player object for ${currentPlayer.name}. Executing kit commands via server context.`);
                    console.log(`[Zenix Script] Targeting player with selector: ${playerName}`); 

                    try {
                        // Use world.getDimension().runCommandAsync for robustness
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:stone_sword 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:stone_axe 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:cooked_beef 32 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:chainmail_helmet 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:chainmail_chestplate 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:chainmail_leggings 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:chainmail_boots 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} minecraft:bed 1 0 {"keep_on_death": {}}`);
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} gf_wu:warps 1 0 {"keep_on_death": {}}`); 
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} gf_wu:homes 1 0 {"keep_on_death": {}}`); 
                        await world.getDimension('overworld').runCommandAsync(`give ${playerName} snst_bckp:diamond_backpack 1 0`); 
                        
                        // Add the starter tag using the player's name
                        await world.getDimension('overworld').runCommandAsync(`tag ${playerName} add starter`); 
                        
                        console.log(`[Zenix Script] Player '${currentPlayer.name}' successfully claimed starter kit and was tagged.`);
                        currentPlayer.sendMessage(`§aYour starter kit has been delivered!`); // This message confirms delivery

                    } catch (cmdResult) { 
                        console.error(`[Zenix Script] Kit command execution failed for ${currentPlayer.name}:`);
                        console.error(`  Command Error: '${cmdResult.error || "No specific error provided."}'`);
                        console.error(`  Status Message: '${cmdResult.statusMessage || "No status message provided."}'`);
                        currentPlayer.sendMessage(`§cFailed to give kit. Check Content Log for details. (Code: CMD_SYNTAX_OR_FAIL)`);
                    }
                });
            }
        }
    })
    .catch(error => {
        console.error(`[Zenix Script] Main form.show() promise rejected: ${error}`);
    });
}

// --- Other Helper Functions ---

function Rules(player) {
    console.log(`[Zenix Script] Rules menu opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("Basic Rules")
        .body("§lBasic rules\n §l-NO hate or toxicity of any sort!\n §l-No cheating/hacking/exploiting!\n §l--Please report any exploits! people abusing bugs will get a warning and up to 3 warnings!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] Rules form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] Rules form selection: ${r.selection}`);
        if (r.selection === 1) main(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] Rules form promise rejected: ${error}`);
    });
}

function Info(player) {
    console.log(`[Zenix Script] Info menu opened for player: ${player.name}`);
    const form = new ActionFormData()
        .title("Info")
        .body("§lSelect a page to learn!")
        .button("Zenix")
        .button("Banned Items\nlearn whats banned")
        .button("Item Clearing\n Learn about what items/mobs get cleared!")
        .button("Banned Players")           
        .button("End Expantion")
        .button("Close")
        .button("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] Info form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] Info form selection: ${r.selection}`);
        if (r.selection === 0) Zenix(player);
        else if (r.selection === 1) BannedItems(player);
        else if (r.selection === 2) ItemCl(player);
        else if (r.selection === 3) BannedPlayers(player);
        else if (r.selection === 4) EndEx(player);
        else if (r.selection === 6) main(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] Info form promise rejected: ${error}`);
    });
}

function Zenix(player) {
    console.log(`[Zenix Script] Zenix info opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("Zenix Realms")
        .body("§lI made Zenix purely out of boredom lol but i hope you all have fun!\n§l New Info added SOOOOOON!!!!!!!!!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] Zenix form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] Zenix form selection: ${r.selection}`);
        if (r.selection === 1) Info(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] Zenix form promise rejected: ${error}`);
    });
}

function BannedItems(player) {
    console.log(`[Zenix Script] BannedItems info opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("List Of Banned Items")
        .body("§2Mace §3Given mace core and stick if in inventory!\n§4Any harming pot or arrow (no refund)\n§2enderdragon, wither back pack patterns! §5given 3 diamonds each as compensation!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] BannedItems form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] BannedItems form selection: ${r.selection}`);
        if (r.selection === 1) Info(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] BannedItems form promise rejected: ${error}`);
    });
}

function ItemCl(player) {
    console.log(`[Zenix Script] Item Clearing info opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("Item Clearing info")
        .body("§2§lThese mobs will be despawned unless you name them!\n §2 Zombie\n§2 Zombie Pigman\n§5 Enderman\n§7 Skeleton\n§2§lRemember using a name tag will not despawn them!\n\n§2§lBlocks\n§5 Stone\n§2 Cobble Stone\n§2 Deepslate\n§2 Cobbled Deepslate\n§2 Tuff\n§2 Dirt\n§2 Sand\n§2 Diorite\n §2Granite\n§2 Andesite\n§2 Gravel\n§5§lItems\n§5Rotten Flesh\n§5 Gold Ingot\n§2 Gold nugget\n§5 Golden Sword\n§5 Iron nugget\n§5 Poppy\n§5 Raw gold\n§5 Raw Iron\n §5 Raw Copper\n§5 Redstone\n\n\n§2§lEvery 5 min all of the listed items will despawn/kill!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] ItemCl form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] ItemCl form selection: ${r.selection}`);
        if (r.selection === 1) Info(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] ItemCl form promise rejected: ${error}`);
    });
}
    
function BannedPlayers(player) {
    console.log(`[Zenix Script] Banned Players info opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("Banned Players")
        .body("§2§lNO CURRENTLY BANNED PLAYERS!!!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] BannedPlayers form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] BannedPlayers form selection: ${r.selection}`);
        if (r.selection === 1) Info(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] BannedPlayers form promise rejected: ${error}`);
    });
}

function EndEx(player) {
    console.log(`[Zenix Script] End Expansion info opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("End Expantion!")
        .body("zenix Realms will have a huge end expantion addon!\n The end will be closed until it is added and tested!!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] EndEx form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] EndEx form selection: ${r.selection}`);
        if (r.selection === 1) Info(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] EndEx form promise rejected: ${error}`);
    });
}

function Discord(player) {
    console.log(`[Zenix Script] Discord info opened for player: ${player.name}`);
    const form = new MessageFormData()
        .title("Discord")
        .body("zenix Realms Discord is coming soon!")
        .button1("Close")
        .button2("Return to previous page");

    form.show(player).then(r => {
        if (r.canceled) {
            console.log("[Zenix Script] Discord form was dismissed.");
            return;
        }
        console.log(`[Zenix Script] Discord form selection: ${r.selection}`);
        if (r.selection === 1) Info(player);
    })
    .catch(error => {
        console.error(`[Zenix Script] Discord form promise rejected: ${error}`);
    });
}
    
// --- Event Listener ---

world.beforeEvents.itemUse.subscribe(data => {
    let player = data.source;
    
    if (data.itemStack.typeId === "zeno_dz:starter") {
        console.log(`[Zenix Script] 'zeno_dz:starter' item used by ${player.name}. Opening main form.`);
        system.run(() => main(player));
    }
});

world.afterEvents.playerSpawn.subscribe(data => {
    const player = data.player;
    if (data.initialSpawn && !player.hasTag("zenix_first_spawn_item")) {
        player.runCommandAsync(`give "${player.name}" zeno_dz:starter 1 0 {"keep_on_death": {}}`); // Change minecraft:compass to your desired item ID
        player.runCommandAsync(`tag "${player.name}" add zenix_first_spawn_item`);
        player.sendMessage("§aWelcome To Zenix Realms!");
    }
});