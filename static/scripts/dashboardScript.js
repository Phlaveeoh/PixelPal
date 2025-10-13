window.onload = async () => {
    const res = await fetch('http://localhost:3000/api/pet', {
        method: 'PATCH',
        credentials: 'include'
    });
    
    if (res.ok) {
        const data = await res.json();
        const pet = data.pet;
        console.log(pet);
        document.getElementById("immaginePet").src = pet.url_pet;
    } else {
        console.log("diocane");
    }
}