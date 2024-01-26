//-----------------------------------------[Mapa Mrucznik Role Play]-----------------------------------------//
//----------------------------------------------------*------------------------------------------------------//
//--------------------------------------------(Rewrite by Allerek)-------------------------------------------//
//-------------------------------------------------(v1.0)----------------------------------------------------//
//----------------------------------------------------*------------------------------------------------------//
//----[                                                                                                 ]----//
//----[         |||||             |||||                       ||||||||||       ||||||||||               ]----//
//----[        ||| |||           ||| |||                      |||     ||||     |||     ||||             ]----//
//----[       |||   |||         |||   |||                     |||       |||    |||       |||            ]----//
//----[       ||     ||         ||     ||                     |||       |||    |||       |||            ]----//
//----[      |||     |||       |||     |||                    |||     ||||     |||     ||||             ]----//
//----[      ||       ||       ||       ||     __________     ||||||||||       ||||||||||               ]----//
//----[     |||       |||     |||       |||                   |||    |||       |||                      ]----//
//----[     ||         ||     ||         ||                   |||     ||       |||                      ]----//
//----[    |||         |||   |||         |||                  |||     |||      |||                      ]----//
//----[    ||           ||   ||           ||                  |||      ||      |||                      ]----//
//----[   |||           ||| |||           |||                 |||      |||     |||                      ]----//
//----[  |||             |||||             |||                |||       |||    |||                      ]----//
//----[                                                                                                 ]----//
//----------------------------------------------------*------------------------------------------------------//

#define VERSION "0.1"

#include <open.mp>
#include <a_mysql>
#include "utils/functions.pwn"
#include "utils/mysql.pwn"


main()
{
	print("\n----------------------------------");
	print("M | --- Mrucznik Role Play --- | M");
	print("R | ---        ****        --- | R");
	print("U | ---        v1.0        --- | U");
	print("C | ---        ****        --- | C");
	print("Z | ---    by Allerek      --- | Z");
	print("N | ---                    --- | N");
	print("I | ---       /\\_/\\        --- | I");
	print("K | ---   ===( *.* )===    --- | K");
	print("  | ---       \\_^_/        --- |  ");
	print("R | ---         |          --- | R");
	print("P | ---         O          --- | P");
	print("----------------------------------\n");
	
}


public OnGameModeInit()
{
	//-------<[ Debug check ]>-------
	//Mo?na zaimplementowa? system jak na Mruczniku - chwilowo tego nie robimy, trzymamy si? prostych za?o?e?
	#if IS_PRODUCTION == bool:true
		#if IS_DEBUG == bool:true
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			print("Wersja debug na produkcji!! Wylaczam serwer.");
			SendRconCommand("exit");
			return 0;
		#endif
	#endif
	SetGameModeText("Mrucznik-RP "VERSION);
	SetWeather(3);
	AllowInteriorWeapons(true);
	ShowPlayerMarkers(PLAYER_MARKERS_MODE_OFF);
	DisableInteriorEnterExits();
	EnableStuntBonusForAll(false);
	ManualVehicleEngineAndLights();
	ShowNameTags(true);
	SetNameTagDrawDistance(70.0);
	if(MySQL_Init()){
		//TODO - debugowe opcje MySQL
		print("\nMySQL za?adowane.\n");
		LoadAllLeaders();
	}
}