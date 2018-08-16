# kulturhuset

Der er intet admin panel. Valgte at fokusere på at afprøve en masse og arbejde med ting fra flere vinkler, det betød at jeg flere gange startede forfra med bestemte funktioner på siden, eksempelvis booking systemet.

Husk evt. at ændre db_config.js filen i config mappen.

Jeg benytter mig af express.

## Routes
* /
    
    Renderer forsiden.
* /booking
    
    Renderer booking siden.
* /bookedSeats
    
    Returnerer alle reserverede sæder. (GET)
* /stage
    
    Returnerer alle rækker og kolonner i en bestemt sal. (GET)
* /events
    
    Returnerer alle begivenheder. (GET)
* /event
    
    Returnerer en bestemt begivenhed. (GET)
* /booking
    
    Opretter en reservation i databasen. (POST)
* /bookingcomplete
    
    Renderer booking bekræftigelses siden.
* /news
    
    Returnerer alle nyheder. (GET)

## Databaser

* booking database

    |id     |event_id   |name   |email|phone |booking_unix|token|
    |:------|:------|:------|:---------|:-------|:------------|:------------|
    |int(11)|int(11)|var(55)|var(55)   |int(11)|var(25)       |var(55)|

* booking_seat database

    |id     |booking_id   |event_id   |seat|
    |:------|:------|:------|:---------|
    |int(11)|int(11)|int(11)|var(5)   |

* event database

    |id     |title   |description   |time|date|unix|duration|stage|price|
    |:------|:------|:------|:---------|:----|:----|:----|:----|:-----|
    |int(11)|var(55)|var(255)|var(11)|var(11)|var(25)|int(11)|int(11)|dec(5,2)|

* news database

    |id     |unix   |title   |content|
    |:------|:------|:------|:---------|
    |int(11)|var(25)|var(55)|text(300)   |

* stage database

    |id     |rows   |columns   |path|
    |:------|:------|:------|:---------|
    |int(11)|int(11)|int(11)|int(11)   |

## Bemærkninger

Der er flere ting jeg gerne vil lave om, eksempelvis.

* Alle datoer og tidspunkter i databsen skal være i unix.
* En komplet bekræftigelses side når bookingen er gennemført.





