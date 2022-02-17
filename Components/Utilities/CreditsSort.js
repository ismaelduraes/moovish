export function sortCast(credits, setCast){


    const tempCast = {
        acting: [],
        art: [],
        camera: [],
        costume: [],
        directing: [],
        editing: [],
        sound: [],
        soundEffects: [],
        production: [],
        visualEffects: [],
    }

    credits.forEach(item => {
        switch (item.known_for_department.toLowerCase()){
            case 'art':
                tempCast.art.push(item)
                break
            case 'acting':
                tempCast.acting.push(item)
                break
            case 'sound':
                tempCast.sound.push(item)
                break
            case 'production':
                tempCast.production.push(item)
                break
            case 'costume':
                tempCast.costume.push(item)
                break
            case 'visual effects':
                tempCast.visualEffects.push(item)
                break
            case 'sound effects':
                tempCast.soundEffects.push(item)
                break
            case 'editing':
                tempCast.editing.push(item)
                break
            case 'directing':
                tempCast.directing.push(item)
                break
            case 'camera':
                tempCast.camera.push(item)
                break
        }
        })
    setCast(tempCast)
}

export function sortCrew(credits, setCrew){
    //separates cast and crew by department.
    //makes easier to show only the data that is relevant since
    //tmdb doesnt sort crew and cast by their departments themselves

    const tempCrew = {
        acting: [],
        art: [],
        camera: [],
        costume: [],
        directing: [],
        editing: [],
        sound: [],
        soundEffects: [],
        production: [],
        visualEffects: [],
    }


    credits.forEach(item => {
        switch (item.department.toLowerCase()){
            case 'art':
                tempCrew.art.push(item)
                break
            case 'acting':
                tempCrew.acting.push(item)
                break
            case 'sound':
                tempCrew.sound.push(item)
                break
            case 'production':
                tempCrew.production.push(item)
                break
            case 'costume':
                tempCrew.costume.push(item)
                break
            case 'visual effects':
                tempCrew.visualEffects.push(item)
                break
            case 'sound effects':
                tempCrew.soundEffects.push(item)
                break
            case 'editing':
                tempCrew.editing.push(item)
                break
            case 'directing':
                tempCrew.directing.push(item)
                break
            case 'camera':
                tempCrew.camera.push(item)
                break
        }
    })

    setCrew(tempCrew)
}