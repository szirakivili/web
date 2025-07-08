function getCoordinates() {
    const urlParams = new URLSearchParams(window.location.search);
    let latitude = urlParams.get('lat');
    let longitude = urlParams.get('lon');

    if (latitude && longitude) {
        return { lat: parseFloat(latitude), lon: parseFloat(longitude) };
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    // Update the URL with GPS coordinates
                    updateUrlParams(latitude, longitude);
                    // You can now use these coordinates
                    return { lat: latitude, lon: longitude };
                },
                (error) => {
                    let errorMessage = "Nem sikerült a helymeghatrozás";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += ", mert nincs engedélyezve.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += ", mert nem határozható meg a pozíciód.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += ", mert időtúllépés történt.";
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage += ", mert ismeretlen hiba lépett fel.";
                            break;
                    }
                    alert(errorMessage + "\nA megjelenő adatok Budapesten érvényesek."); // Popup error message
                }
            );
        } else {
            const errorMessage = "Ez a böngésző nem támogatja a helymeghatározást.";
            alert(errorMessage + "\nA megjelenő adatok Budapesten érvényesek."); // Popup error message
        }
    }
    return null; // Return null if coordinates are not immediately available
}

function updateUrlParams(lat, lon) {
    const url = new URL(window.location.href);
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
    window.history.pushState({ path: url.href }, '', url.href);
}

document.addEventListener('DOMContentLoaded', () => {
    const latitude = 47.497885; // Budapest szélessége
    const longitude = 19.040269; // Budapest hosszúsága
    getCoordinates();
    const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&time_format=24`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                const results = data.results;

                // Időpontok beillesztése
                document.getElementById('napfelkelte').querySelector('.time').textContent = results.sunrise;
                document.getElementById('naplemente').querySelector('.time').textContent = results.sunset;
                document.getElementById('del').querySelector('.time').textContent = results.solar_noon;
                document.getElementById('vilagossag-kezdete').querySelector('.time').textContent = results.dawn;
                document.getElementById('vilagossag-vege').querySelector('.time').textContent = results.dusk;
                document.getElementById('teljes-sotetseg-kezdete').querySelector('.time').textContent = results.last_light;
                document.getElementById('teljes-sotetseg-vege').querySelector('.time').textContent = results.first_light;
                document.getElementById('nappal-hossza').querySelector('.time').textContent = results.day_length;
                document.getElementById('arany-ora').querySelector('.time').textContent = results.golden_hour;
            } else {
                console.error("Hiba az API hívásban:", data.status, data.message);
                document.querySelectorAll('.time').forEach(el => el.textContent = 'N/A');
            }
        })
        .catch(error => {
            console.error("Hiba történt a lekérés során:", error);
            document.querySelectorAll('.time').forEach(el => el.textContent = 'Hiba');
        });

    // --- IMPROVED ANIMATIONS SECTION ---
    const addSvgIllustration = (boxId, svgContent) => {
        const box = document.getElementById(boxId);
        if (box) {
            const illustrationDiv = box.querySelector('.illustration');
            if (illustrationDiv) {
                illustrationDiv.innerHTML = svgContent;
            }
        }
    };

    // Napfelkelte illusztráció - Enhanced with rays and smoother animation
    addSvgIllustration('napfelkelte', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="sunriseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFD700" />
                    <stop offset="100%" stop-color="#FF8C00" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Sun with pulsing glow -->
            <circle cx="50" cy="80" r="30" fill="url(#sunriseGrad)" filter="url(#glow)">
                <animateTransform attributeName="transform"
                                  type="translate"
                                  values="0,60; 0,-30; 0,-120"
                                  keyTimes="0; 0.3; 1"
                                  dur="4s"
                                  repeatCount="indefinite"
                                  calcMode="spline"
                                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
            </circle>
        </svg>
    `);

    // Naplemente illusztráció - More dramatic sunset with color shifts
    addSvgIllustration('naplemente', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FA8405" />
                    <stop offset="100%" stop-color="#8B0000" />
                </linearGradient>
                <radialGradient id="skyGrad" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
                    <stop offset="0%" stop-color="#FA8405" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#2D3CD6" stop-opacity="1" />
                </radialGradient>
                <filter id="sunsetGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Sun with glow -->
            <circle cx="50" cy="20" r="30" fill="url(#sunsetGrad)" filter="url(#sunsetGlow)">
                <animateTransform attributeName="transform"
                                  type="translate"
                                  values="0,-60; 0,30; 0,120"
                                  keyTimes="0; 0.3; 1"
                                  dur="4s"
                                  repeatCount="indefinite"
                                  calcMode="spline"
                                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
            </circle>
        </svg>
    `);

    // Dél illusztráció - More dynamic sun with orbiting planets
    addSvgIllustration('del', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <radialGradient id="sunRadial" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#FFFF00" />
                    <stop offset="100%" stop-color="#FFD700" />
                </radialGradient>
                <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Sun -->
            <circle cx="50" cy="50" r="25" fill="url(#sunRadial)" filter="url(#sunGlow)">
                <animate attributeName="r" values="25;35;25" dur="5s" repeatCount="indefinite" />
            </circle>
        </svg>
    `);

    // Nappal hossza illusztráció - Day/night cycle with smooth transitions
    addSvgIllustration('nappal-hossza', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <!-- Nap fénye -->
                <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="glow" />
                <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
                </filter>

                <!-- Hold fénye -->
                <filter id="moonGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <!-- Nap pálya -->
                <path id="orbitSun" d="M 50 50 m -30,0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0" fill="none"/>

                <!-- Hold pálya (félkörrel eltolva) -->
                <path id="orbitMoon" d="M 50 50 m 30,0 a 30,30 0 1,1 -60,0 a 30,30 0 1,1 60,0" fill="none"/>
            </defs>

            <!-- Nap -->
            <circle r="6" fill="#FFD700" filter="url(#sunGlow)">
                <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
                <mpath href="#orbitSun" />
                </animateMotion>
                <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" />
            </circle>

            <!-- Hold -->
            <circle r="5" fill="#B0BEC5" filter="url(#moonGlow)">
                <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
                <mpath href="#orbitMoon" />
                </animateMotion>
                <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
            </circle>
            </svg>
    `);

    // Világosság kezdete illusztráció - Dawn with color gradient shifts
    addSvgIllustration('vilagossag-kezdete', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="dawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#1A237E" />
                    <stop offset="50%" stop-color="#4FC3F7" />
                    <stop offset="100%" stop-color="#BBDEFB" />
                </linearGradient>
                <radialGradient id="dawnSun" cx="50%" cy="100%" r="50%" fx="50%" fy="100%">
                    <stop offset="0%" stop-color="#FFD700" />
                    <stop offset="100%" stop-color="#FF8C00" stop-opacity="0" />
                </radialGradient>
            </defs>
            
            <!-- Sky gradient -->
            <rect x="0" y="0" width="100" height="100" fill="url(#dawnGrad)"/>
            
            <!-- Rising sun effect -->
            <circle cx="50" cy="100" r="40" fill="url(#dawnSun)">
                <animateTransform attributeName="transform"
                                  type="translate"
                                  values="0 0; 0 -30; 0 0"
                                  keyTimes="0; 0.5; 1"
                                  dur="6s"
                                  repeatCount="indefinite"
                                  calcMode="spline"
                                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
            </circle>
            
            <!-- Morning mist -->
            <rect x="0" y="70" width="100" height="30" fill="#FFF" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="5s" repeatCount="indefinite" />
                <animate attributeName="height" values="30;20;30" dur="7s" repeatCount="indefinite" />
            </rect>
        </svg>
    `);

    // Világosság vége illusztráció - Dusk with dramatic colors
    addSvgIllustration('vilagossag-vege', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="duskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FF4500" />
                    <stop offset="50%" stop-color="#8B0000" />
                    <stop offset="100%" stop-color="#1A237E" />
                </linearGradient>
                <radialGradient id="duskSun" cx="50%" cy="0%" r="50%" fx="50%" fy="0%">
                    <stop offset="0%" stop-color="#FF8C00" />
                    <stop offset="100%" stop-color="#FF4500" stop-opacity="0" />
                </radialGradient>
            </defs>
            
            <!-- Sky gradient -->
            <rect x="0" y="0" width="100" height="100" fill="url(#duskGrad)">
                <!--animate attributeName="fill">
                    <animate begin="0s" dur="8s" values="url(#duskGrad);url(#duskGrad2);url(#duskGrad)" 
                             repeatCount="indefinite" />
                </animate-->
            </rect>
            
            <!-- Setting sun effect -->
            <circle cx="50" cy="0" r="40" fill="url(#duskSun)">
                <animateTransform attributeName="transform"
                                  type="translate"
                                  values="0 100; 0 130; 0 100"
                                  keyTimes="0; 0.5; 1"
                                  dur="6s"
                                  repeatCount="indefinite"
                                  calcMode="spline"
                                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
            </circle>
            
            <!-- Evening mist -->
            <rect x="0" y="70" width="100" height="30" fill="#8B0000" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="5s" repeatCount="indefinite" />
                <animate attributeName="height" values="30;20;30" dur="7s" repeatCount="indefinite" />
            </rect>
        </svg>
    `);

    // Teljes sötétség kezdete illusztráció - Starry night with shooting stars
    addSvgIllustration('teljes-sotetseg-kezdete', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Night sky -->
            <rect x="0" y="0" width="100" height="100" fill="#000033" />
            
            <!-- Stars -->
            ${Array.from({length: 50}).map((_, i) => {
                const cx = Math.random() * 100;
                const cy = Math.random() * 80;
                const r = Math.random() * 1.5 + 0.5;
                const opacity = Math.random() * 0.8 + 0.2;
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 5;
                return `
                    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFF" opacity="${opacity}" filter="url(#starGlow)">
                        <animate attributeName="opacity" values="${opacity};${opacity*0.5};${opacity}" 
                                 dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
                    </circle>
                `;
            }).join('')}
            
            <!-- Milky Way -->
            <path d="M0 40 Q30 20 60 30 Q80 40 100 35" stroke="rgba(255,255,255,0.1)" stroke-width="5" fill="none" />
            <path d="M0 45 Q30 25 60 35 Q80 45 100 40" stroke="rgba(255,255,255,0.1)" stroke-width="3" fill="none" />
            
            <!-- Horizon silhouette -->
            <path d="M0 80 L20 60 L40 70 L60 50 L80 75 L100 65 L100 80 Z" fill="#000" opacity="0.8" />
        </svg>
    `);

    // Teljes sötétség vége illusztráció - Pre-dawn with fading stars
    addSvgIllustration('teljes-sotetseg-vege', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="predawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#000033" />
                    <stop offset="50%" stop-color="#1A237E" />
                    <stop offset="100%" stop-color="#4FC3F7" />
                </linearGradient>
                <filter id="fadingStarGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Pre-dawn sky -->
            <rect x="0" y="0" width="100" height="100" fill="url(#predawnGrad)"/>
            
            <!-- Fading stars -->
            ${Array.from({length: 30}).map((_, i) => {
                const cx = Math.random() * 100;
                const cy = Math.random() * 80;
                const r = Math.random() * 1.5 + 0.5;
                const opacity = Math.random() * 0.6 + 0.2;
                const duration = Math.random() * 3 + 2;
                const delay = Math.random() * 5;
                return `
                    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFF" opacity="${opacity}" filter="url(#fadingStarGlow)">
                        <animate attributeName="opacity" values="${opacity};0;${opacity}" 
                                 dur="${duration}s" begin="${delay}s" repeatCount="indefinite" />
                    </circle>
                `;
            }).join('')}
            
            <!-- Early morning light -->
            <circle cx="50" cy="100" r="40" fill="#4FC3F7" opacity="0.2">
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="8s" repeatCount="indefinite" />
                <animateTransform attributeName="transform"
                                  type="translate"
                                  values="0 0; 0 -10; 0 0"
                                  keyTimes="0; 0.5; 1"
                                  dur="10s"
                                  repeatCount="indefinite"
                                  calcMode="spline"
                                  keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"/>
            </circle>
            
            <!-- Horizon silhouette -->
            <path d="M0 80 L20 60 L40 70 L60 50 L80 75 L100 65 L100 80 Z" fill="#000" opacity="0.8" />
        </svg>
    `);

    // Arany óra illusztráció - Golden hour with animated light rays
    addSvgIllustration('arany-ora', `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
                <radialGradient id="goldenHourGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stop-color="#FFD700" />
                    <stop offset="100%" stop-color="#FF8C00" stop-opacity="0.7" />
                </radialGradient>
                <filter id="goldenGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            <!-- Golden light background -->
            <rect x="0" y="0" width="100" height="100" fill="url(#goldenHourGrad)" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.6;0.8" dur="5s" repeatCount="indefinite" />
            </rect>
            
            <!-- Sun low in the sky -->
            <circle cx="50" cy="70" r="25" fill="#FFD700" filter="url(#goldenGlow)">
                <animate attributeName="cx" values="50;52;50" dur="5s" repeatCount="indefinite" />
                <animate attributeName="cy" values="70;72;70" dur="7s" repeatCount="indefinite" />
            </circle>
            
            <!-- Light rays -->
            ${Array.from({length: 16}).map((_, i) => {
                const angle = i * (360/16);
                const length = 40 + Math.random() * 20;
                return `
                    <line x1="50" y1="70" 
                          x2="${50 + Math.cos(angle * Math.PI/180) * length}" 
                          y2="${70 + Math.sin(angle * Math.PI/180) * length}" 
                          stroke="#FFD700" stroke-width="2" stroke-opacity="0.5">
                        <animate attributeName="stroke-opacity" values="0.5;0.8;0.5" dur="${3+i*0.2}s" repeatCount="indefinite" />
                        <animate attributeName="x2" 
                                 values="${50 + Math.cos(angle * Math.PI/180) * length};${50 + Math.cos(angle * Math.PI/180) * (length+5)};${50 + Math.cos(angle * Math.PI/180) * length}" 
                                 dur="${4+i*0.3}s" repeatCount="indefinite" />
                        <animate attributeName="y2" 
                                 values="${70 + Math.sin(angle * Math.PI/180) * length};${70 + Math.sin(angle * Math.PI/180) * (length+5)};${70 + Math.sin(angle * Math.PI/180) * length}" 
                                 dur="${4+i*0.3}s" repeatCount="indefinite" />
                    </line>
                `;
            }).join('')}
            
            <!-- Landscape with long shadows -->
            <!--path d="M0 80 L20 60 L40 70 L60 50 L80 75 L100 65 L100 80 Z" fill="#654321" opacity="1" /-->
        </svg>
    `);
});