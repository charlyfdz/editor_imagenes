const fileInput =  document.querySelector(".file-input")

const filterOptions = document.querySelectorAll(".filter button"),
      filterName = document.querySelector(".filter-info .name"),
      filterSlider = document.querySelector(".slider input"),
      filterValue = document.querySelector(".slider .value")

const rotateOptions = document.querySelectorAll(".rotate button")

const previewImage = document.querySelector(".preview-img img"),
      previewImageContainer = document.querySelector(".preview-img")

const chooseImgBtn = document.querySelector(".choose-img"),
      resetFilterBtn = document.querySelector(".reset-filter"),
      saveImageBtn = document.querySelector(".save-img")


let brightness = 100, 
    saturation = 100, 
    inversion = 0, 
    grayscale = 0;

let rotate = 0,
    flipHorizontal = 1;
    flipVertical = 1;

const applyFilters = ()=>{
    previewImage.style.transform = `rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`
    previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

const loadImage = ()=>{
    
    let file = fileInput.files[0];

    if(!file) return

    previewImage.src = URL.createObjectURL(file);
    previewImage.addEventListener("load",()=>{
        resetFilterBtn.click()
        document.querySelector(".container").classList.remove("disable")
    })
}

filterOptions.forEach(option=>{
    option.addEventListener("click",()=>{

        document.querySelector(".filter .active").classList.remove("active")
        option.classList.add("active")
        filterName.innerText = option.innerText

        if(option.id==="brightness"){
            filterSlider.max = "200"
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`
        }else if(option.id==="saturation"){
            filterSlider.max = "200"
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        }else if(option.id==="inversion"){
            filterSlider.max = "100"
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`
        }else{
            filterSlider.max = "100"
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`
        }
    })
})

rotateOptions.forEach(option=>{

    option.addEventListener("click",()=>{
        if(option.id === "left"){
            rotate -= 90;
        }else if(option.id === "right"){
            rotate += 90;
        }else if(option.id === "vertical"){
            flipVertical = flipVertical === 1 ? -1 : 1;
        }else{
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        applyFilters()
    })
})

const updateFilter = ()=>{

    filterValue.innerText = `${filterSlider.value}%`
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    }else if(selectedFilter.id === "saturation"){
        saturation = filterSlider.value
    }else if(selectedFilter.id === "inversion"){
        inversion = filterSlider.value
    }else{
        grayscale = filterSlider.value
    }

    applyFilters()
}

const resetFilter = () =>{
    brightness = 100
    saturation = 100 
    inversion = 0 
    grayscale = 0

    rotate = 0
    flipHorizontal = 1
    flipVertical = 1

    filterOptions[0].click()

    applyFilters()
}

const saveImage = ()=>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    ctx.translate(canvas.width/2, canvas.height/2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImage, -canvas.width /2,-canvas.height /2, canvas.width, canvas.height);

    const link = document.createElement("a")
    link.download = "edited.jpg"
    link.href = canvas.toDataURL();
    link.click();
}

fileInput.addEventListener("change", loadImage)
filterSlider.addEventListener("input",updateFilter)
resetFilterBtn.addEventListener("click",resetFilter)
saveImageBtn.addEventListener("click",saveImage)
chooseImgBtn.addEventListener("click",()=>fileInput.click())