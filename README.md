# Metro Ara

Una web ben senzilla per mirar el pas dels metros en temps real.

Domini Vercel: https://metro-ara.vercel.app/

Domini propi: https://metro.rodalies.top

## Endpoints utilitzats

### Pel transit en temps reala una estació concreta:

```
https://api.tmb.cat/v1/itransit/metro/estacions?estacions=516&app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f
```

Per identificar l'estació s'utilitza el codi d'estació (que no és el mateix que el id de estació)

#### Exemple de resposta
```
{
  "timestamp": 1793190708960,
  "linies": [
    {
      "codi_linia": 5,
      "nom_linia": "L5",
      "nom_familia": "Metro",
      "codi_familia": 1,
      "color_linia": "005A97",
      "estacions": [
        {
          "codi_via": 1,
          "id_sentit": 1,
          "codi_estacio": 516,
          "linies_trajectes": [
            {
              "codi_linia": 5,
              "nom_linia": "L5",
              "color_linia": "005A97",
              "codi_trajecte": "0051",
              "desti_trajecte": "Vall d'Hebron",
              "propers_trens": [
                {
                  "codi_servei": "515",
                  "temps_arribada": 1793190800000
                },
                {
                  "codi_servei": "517",
                  "temps_arribada": 1793190971000
                }
              ]
            }
          ]
        },
        {
          "codi_via": 2,
          "id_sentit": 2,
          "codi_estacio": 516,
          "linies_trajectes": [
            {
              "codi_linia": 5,
              "nom_linia": "L5",
              "color_linia": "005A97",
              "codi_trajecte": "0052",
              "desti_trajecte": "Cornellà Centre",
              "propers_trens": [
                {
                  "codi_servei": "526",
                  "temps_arribada": 1793190738000
                },
                {
                  "codi_servei": "527",
                  "temps_arribada": 1793190954000
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

Els UNIX Timestamps de `temps_arribada` ens donen la informació que necessitem.

### Per saber informació (estàtica) sobre les estacions:

```
https://api.tmb.cat/v1/transit/linies/metro/estacions?app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f
```

*Nota: també hi ha un endpoint similar que retorna el mateix tipus d'informació però més reduïda: `https://api.tmb.cat/v1/transit/estacions?app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f`.*

#### Exemple de resposta
Serà un JSON amb moltes estacions, cada una d'elles mostrant la seva informació. Per exemple per Badal:

```json
{
  "type": "Feature",
  "id": "ESTACIONS_LINIA.fid-4adcea27_1a182410468_6764",
  "geometry": {
    "type": "Point",
    "coordinates": [
      2.12740211,
      41.37558063
    ]
  },
  "geometry_name": "GEOMETRY",
  "properties": {
    "ID_ESTACIO_LINIA": 520,
    "CODI_ESTACIO_LINIA": 516,
    "ID_GRUP_ESTACIO": 516,
    "CODI_GRUP_ESTACIO": 6660516,
    "ID_ESTACIO": 76,
    "CODI_ESTACIO": 516,
    "NOM_ESTACIO": "Badal",
    "ORDRE_ESTACIO": 9,
    "ID_LINIA": 3,
    "CODI_LINIA": 5,
    "NOM_LINIA": "L5",
    "ORDRE_LINIA": 5,
    "ID_TIPUS_SERVEI": 1,
    "DESC_SERVEI": "Cornellà Centre - Vall d'Hebron",
    "ORIGEN_SERVEI": "Cornellà Centre",
    "DESTI_SERVEI": "Vall d'Hebron",
    "ID_TIPUS_ACCESSIBILITAT": 1,
    "NOM_TIPUS_ACCESSIBILITAT": "Accessible",
    "ID_TIPUS_ESTAT": 1,
    "NOM_TIPUS_ESTAT": "Operatiu",
    "DATA_INAUGURACIO": "1969-11-29Z",
    "DATA": "2026-10-27Z",
    "COLOR_LINIA": "005A97",
    "PICTO": "L5",
    "PICTO_GRUP": "L5"
  }
}
```

## Com obtenir els codis de les estacions

A partir de la resposta completa de `https://api.tmb.cat/v1/transit/linies/metro/estacions?app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f` ens guardem el JSON a dins de `public/estacions-info.json` i després executem un script python propi anomenat `obtenir-codis-estacions.py`, que genera la informació que trobem a `public/estacions-info.json`.

*Nota: alternativament haguéssim pogut fer tot via API calls utilitzant filtres per nom o codi d'estació tipus `https://api.tmb.cat/v1/transit/estacions?filter=NOM_ESTACIO%20like%20%27Badal%27&app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f`. Però fer-ho estàticament (les parades de metro no solen canviar xd) és més ràpid.*


## Disseny de UX

L'usuari se li mostren diverses línies amb els seus pictogrames fets via CSS (un quadrat de color solid i el nom de la línia com a text de color blanc)

L1 - #cb2508 (vermella)
L2 - #90278e (lila)
L3 - #067634 (verda)
L4 - #ffc10e (groga)
L5 - #006b9d (blava)
L9S - #df8d33 (taronja)
L9N - #df8d33 (taronja)
L10S - #31a8e0 (blau clar)
L10N - #31a8e0 (blau clar)
L11 - #9ed84c (verd clar)

*Nota: També hi ha les següents altres línies de metro L6 - #847dc6 (lila apagat), L7 - #ad6219 (marró), L8 - #e659b4 (rosa) i L12 - #bab7d7 (gris lilós), però aquestes no formen part de la API de TMB (no hi han dades), així que a `metro-ara` decidim ignorar-les.*

## Funcionament UX
Quan l'usuari clica una línia entra en la seva pàgina i es mostren les seves estacions seguint una tira de color sòlid i amb nodes a cada estació amb el seu nom (igual que en les infografies del metro).

Al clicar un node es va a la pàgina d'aquella estació, on es mostra per cada línia que té l'estació i en les dues direccions el metro que està arribant i el següent metro que arribarà després (amb menys opacitat), tal com a les pantalles de les andanes de metro.

El disseny CSS recreant aquestes pantalles d'andana està inspirat de [`andana.bcn.am`](https://andana.bcn.am/):

```html
<div class="space-y-5">
  <div class="border-b border-white/20 -mx-7 my-5"></div>
  <div>
    <div class="flex items-center gap-2.5">
      <img alt="L5" class="h-7 w-7 shrink-0" src="/logos/L5.svg">
      <div class="h-7 flex flex-col justify-between min-w-0">
        <span class="text-[10px] text-white/50 font-normal leading-none">Direcció</span>
        <span class="text-[16px] font-bold text-white leading-tight break-words">Cornellà Centre</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-2.5">
      <div class="text-left cursor-pointer">
        <div class="font-bold text-white tracking-tight leading-none font-sans tabular-nums text-[26px] sm:text-[28px]">Estacionat</div>
        <div class="text-[11px] text-white/75 font-normal mt-1 font-sans min-h-[16px]">Torn 537</div>
      </div>
      <div class="text-left cursor-pointer">
        <div class="font-bold text-white/50 tracking-tight leading-none font-sans tabular-nums text-[26px] sm:text-[28px]">01:43</div>
        <div class="text-[11px] text-white/35 font-normal mt-1 font-sans min-h-[16px]">Torn 538</div>
      </div>
    </div>
  </div>
  <div>
    <div class="flex items-center gap-2.5">
      <img alt="L5" class="h-7 w-7 shrink-0" src="/logos/L5.svg">
      <div class="h-7 flex flex-col justify-between min-w-0">
        <span class="text-[10px] text-white/50 font-normal leading-none">Direcció</span>
        <span class="text-[16px] font-bold text-white leading-tight break-words">Vall d'Hebron</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-2.5">
      <div class="text-left cursor-pointer">
        <div class="font-bold text-white tracking-tight leading-none font-sans tabular-nums text-[26px] sm:text-[28px]">01:57</div>
        <div class="text-[11px] text-white/75 font-normal mt-1 font-sans min-h-[16px]">Torn 512</div>
      </div>
      <div class="text-left cursor-pointer">
        <div class="font-bold text-white/50 tracking-tight leading-none font-sans tabular-nums text-[26px] sm:text-[28px]">03:58</div>
        <div class="text-[11px] text-white/35 font-normal mt-1 font-sans min-h-[16px]">Torn 513</div>
      </div>
    </div>
  </div>
</div>
```

I el de la tira per cada línia amb les parades també:

````html
<div class="flex flex-col">
  <div class="mb-6 h-[46px] select-none pointer-events-none opacity-0"></div>
  <div class="relative w-max flex">
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Cornellà Centre</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Gavarra</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Sant Ildefons</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Can Boixeres</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Can Vidalet</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Pubilla Cases</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Ernest Lluch</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Collblanc</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Badal</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Plaça de Sants</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Sants Estació</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Entença</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Hospital Clínic</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Diagonal</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Verdaguer</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Sagrada Família</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Sant Pau | Dos de Maig</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Camp de l'Arpa</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">La Sagrera</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Congrés</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Maragall</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Virrei Amat</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Vilapicina</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Horta</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">El Carmel</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">El Coll | La Teixonera</div>
    </div>
    <div class="relative shrink-0">
      <div class="absolute left-0 origin-bottom-left -rotate-45 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer bottom-3 text-white">Vall d'Hebron</div>
    </div>
  </div>
  <div class="relative h-[25px] rounded-full shadow-lg">
    <div id="diagram-st-desktop-cornellà-centre" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-gavarra" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-sant-ildefons" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-can-boixeres" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-can-vidalet" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-pubilla-cases" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-ernest-lluch" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-collblanc" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-badal" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-plaça-de-sants" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-sants-estació" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-entença" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-hospital-clínic" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-diagonal" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-verdaguer" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-sagrada-família" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-sant-pau-|-dos-de-maig" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-camp-de-l'arpa" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-la-sagrera" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-congrés" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-maragall" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-virrei-amat" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-vilapicina" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-horta" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-el-carmel" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-el-coll-|-la-teixonera" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-st-desktop-vall-d'hebron" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-pointer group">
      <div class="w-[22px] h-[22px] rounded-full bg-white border-[4px] border-black shadow-sm group-hover:scale-125 transition-all "></div>
    </div>
    <div id="diagram-train-desktop-5-506" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">506</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Cornellà Centre</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">01:17</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-508" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">508</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Parada:
          <span class="text-white font-bold">El Coll | La Teixonera</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Estacionat</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-509" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">509</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Horta</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Entra</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-510" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">510</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Vilapicina</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">00:46</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-512" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">512</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Parada:
          <span class="text-white font-bold">La Sagrera</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Estacionat</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-513" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">513</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Parada:
          <span class="text-white font-bold">Camp de l'Arpa</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Estacionat</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-515" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">515</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Parada:
          <span class="text-white font-bold">Sagrada Família</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Estacionat</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-517" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">517</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Diagonal</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">00:39</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-518" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">518</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Entença</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">00:22</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-519" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">519</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Plaça de Sants</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Entra</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-520" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">520</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Parada:
          <span class="text-white font-bold">Ernest Lluch</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Estacionat</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-521" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">521</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Can Vidalet</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">Entra</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-523" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">523</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Sant Ildefons</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">00:45</span>
        </div>
      </div>
    </div>
    <div id="diagram-train-desktop-5-524" class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-[25] group transition-[left] duration-1000 ease-linear cursor-pointer ">
      <div class="relative z-10"></div>
      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white p-3 rounded-xl shadow-2xl transition-opacity pointer-events-none w-56 z-50 font-sans select-none opacity-0">
        <div class="mb-2.5">
          <div class="led-matrix-box">
            <span class="led-matrix-display text-2xl sm:text-3xl ">524</span>
          </div>
        </div>
        <div class="text-xs text-white/50 mb-1">
          Propera:
          <span class="text-white font-bold">Gavarra</span>
        </div>
        <div class="text-xs text-white/50 mb-2">
          Direcció:
          <span class="text-white font-bold">Vall d'Hebron</span>
        </div>
        <div class="flex items-baseline justify-between text-white pt-2 border-t border-white/15">
          <span class="text-white/50 text-xs font-normal">Arribada:</span>
          <span class="font-sans text-xl font-bold tabular-nums text-white tracking-tight">01:20</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Seguretat
Les API calls es fan des de la api interna que generem amb app/api de NextJS per tal de no exposar la TMB_APP_KEY i TMB_APP_ID que es guarden a un fitxer de variables d'entorn `.env.local`.

Els exemples mostrats en aquest README són valors d'exemple (actualment encara en funcionament però que canviaré després de publicar aquest repositori).

## Llicència
MIT
