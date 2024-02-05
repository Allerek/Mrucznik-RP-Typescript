import { GameMode } from "@infernus/core";
import "./mysql/mysql";
import "./login/login";
import "./commands/commands";
import "./vehicles/vehicles";
import { initSkinSelector } from "./login/skinSelector";
GameMode.onInit(({next}) => {
    console.log("----------------------------------");
    console.log("M | --- Mrucznik Role Play --- | M");
    console.log("R | ---        ****        --- | Rp");
    console.log("U | ---        v1.0        --- | U");
    console.log("C | ---        ****        --- | C");
    console.log("Z | ---    by Allerek      --- | Z");
    console.log("N | ---                    --- | N");
    console.log("I | ---       /\\_/\\        --- | I");
    console.log("K | ---   ===( *.* )===    --- | K");
    console.log("  | ---       \\_^_/        --- |  ");
    console.log("R | ---         |          --- | R");
    console.log("P | ---         O          --- | P");
    console.log("----------------------------------");
    initSkinSelector();
    next();
});