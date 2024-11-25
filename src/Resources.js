class Resources {
    constructor() {
        //Everything we plan to download
        this.toLoad = {
            sky: '/2d-web-RPG/public/sprites/sky.png',
            ground: '/2d-web-RPG/public/sprites/ground.png',
            hero: '/2d-web-RPG/public/sprites/hero-sheet.png',
            shadow: '/2d-web-RPG/public/sprites/shadow.png',
        };

        //A bucket to keep all of our images
        this.images = {};

        //Load each image
        Object.keys(this.toLoad).forEach((key) => {
            const img = new Image();
            img.src = this.toLoad[key];
            this.images[key] = {
                image: img,
                isLoaded: false,
            };

            img.onload = () => {
                this.images[key].isLoaded = true;
            };
        });
    }
}

//Create one instance for the whole app to use
export const resources = new Resources();
