# Metro Ara

Una web ben senzilla per mirar el pas dels metros en temps real.

Domini Vercel: https://metro-ara.vercel.app/

Domini propi: [metro.rodalies.top](https://metro.rodalies.top)

## Endpoints utilitzats

### Pel transit en temps reala una estació concreta:

```
https://api.tmb.cat/v1/itransit/metro/estacions?estacions=516&app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f
```

*Nota: Els `app_id` i `app_key` són d'exemple, cal que et registris a [developer.tmb.cat](https://developer.tmb.cat/docs/getting-started) i creis una app per obtenir un id i key que puguis utilitzar.*

Per identificar l'estació s'utilitza el codi d'estació (que no és el mateix que el id de estació).

#### Exemple de resposta
```json
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

### Per saber informació sobre les estacions:

```
https://api.tmb.cat/v1/transit/linies/metro/estacions?app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f
```

*Nota: també hi ha un endpoint similar que retorna el mateix tipus d'informació però més reduïda: `https://api.tmb.cat/v1/transit/estacions?app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f`.*

#### Exemple de resposta
Serà un JSON amb un array amb moltes estacions, cada una d'elles mostrant la seva informació. Per exemple per Badal:

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

A partir de la resposta completa de `https://api.tmb.cat/v1/transit/linies/metro/estacions?app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f` ens guardem el JSON com a fitxer a [`public/estacions-info.json`](public/estacions-info.json) i després executem un script python propi [`obtenir-codis-estacions.py`](/obtenir-codis-estacions.py), que genera la informació que trobem a [`public/codis-estacions.json`](public/codis-estacions.json).

*Nota: alternativament haguéssim pogut fer tot via API calls utilitzant filtres per nom o codi d'estació tipus `https://api.tmb.cat/v1/transit/estacions?filter=NOM_ESTACIO%20like%20%27Badal%27&app_id=f03eaf7e&app_key=e4b38fbbd076a1b952e2d6db45f6b32f`. Però fer-ho estàticament (les parades de metro no solen canviar gaire xd) és més ràpid.*


## Disseny UX

A l'usuari se li mostren les línies de metro (els logos de les quals estan fetes via CSS, un quadrat de color solid i el nom de la línia com a text blanc)

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

*Nota: També hi ha les següents altres línies de metro: L6 - #847dc6 (lila apagat), L7 - #ad6219 (marró), L8 - #e659b4 (rosa) i L12 - #bab7d7 (gris lilós). Però aquestes no formen part de la API de TMB (no hi han dades disponibles), així que decidim ignorar-les.*

## Funcionament UX
Quan l'usuari clica una línia entra a la seva pàgina i es mostren les seves estacions seguint una tira de color sòlid i amb nodes a cada estació amb el seu nom inclinat (recreant les infografies del metro).

Al clicar un node es va a la pàgina d'aquella estació, on es mostra per cada línia en les dues direccions el metro que està arribant i el següent metro que arribarà després (amb menys opacitat), tal com a les pantalles de les andanes de metro.

El disseny CSS que recrea les pantalles del metro està inspirat en la app Andana ([`andana.bcn.am`](https://andana.bcn.am/)), però fet més minimalista.

## Seguretat
Les API calls es fan des de la api interna que generem amb app/api de NextJS per tal de no exposar la `TMB_APP_KEY` i `TMB_APP_ID` que es guarden a un fitxer de variables d'entorn `.env.local`.

Els exemples mostrats en aquest README són valors d'exemple (actualment encara en funcionament però que canviaré després de publicar aquest repositori).

## Llicència
MIT
