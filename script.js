let currentColor='#223030';
let experienceCount=0;
let educationCount=0;
let skills=[];

document.addEventListener('DOMContentLoaded',funtion(){
    
    initializeBuilder();
});

function initializeBuilder(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
        anchor.addEventListener('click',funtion(e){
            e.preventDefault();
            const target=document.querySelector(this.getAttribut('href'));
            if(target){
                target.scrollIntoView({
                    behaviour:'smooth',
                    block:'start'
                });
            }
        });
    });
}


function goToBuilder(){
    document.getElementById('homepage').style.display='none';
    document.getElementById('builderpage').style.display='block';

    /*if(experienceCount==0)
    {
        addExperience();
    }
    if(educationCount==0)
    {
        addEducation();
    }*/
}

function goBackHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('builderPage').style.display = 'none';
}

