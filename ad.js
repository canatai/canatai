// ad.js
const adConfig = {
    ad1: {
        news: {
            type: 'pure-text',
            content: '[NEWS] Ad space available. Contact us for more information.',
            display: false
        },
        jobs: {
            type: 'text-link',
            content: 'Post your job listing here',
            link: 'https://jobpostings.com',
            display: false
        },
        toronto: {
            type: 'pure-text',
            content: '[NEWS] Ad space available. Contact us for more information.',
            display: false
        },
        // Add more categories as needed
    },
    ad2: {
        news: {
            type: 'pure-text',
            content: '[NEWS] Ad space available. Contact us for more information.',
            display: false
        },
        jobs: {
            type: 'pure-text',
            content: '[JOBS] Ad space available. Contact us for more information.',
            display: false
        },
        shopping: {
            ttype: 'pure-text',
            content: '[SHOPPING] Ad space available. Contact us for more information.',
            display: false
        },
        government: {
            type: 'pure-text',
            content: '[GOV] Ad space available. Contact us for more information.',
            display: false
        },
        transportation: {
            type: 'pure-text',
            content: '[TRAFFIC] Ad space available. Contact us for more information.',
            display: false
        },
        finance: {
            type: 'pure-text',
            content: '[FINANCE] Ad space available. Contact us for more information.',
            display: false
        },
        hobby: {
            type: 'pure-text',
            content: '[HOBBY] Ad space available. Contact us for more information.',
            display: false
        },
        community: {
            type: 'pure-text',
            content: '[Group] Ad space available. Contact us for more information.',
            display: false
        },
        toronto: {
            type: 'image-link',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Toronto%2C_Canada.svg',
            link: 'https://jobpostings.com',
            display: false
        },
        
    },
    ad3: {
        // Only text-link or pure-text ads
        type: 'pure-text',
        content: 'Ad space available. Contact us for more information.',
        display: false
    },
    ad4: {
        type: 'pure-text',
        content: 'Ad space available. Contact us for more information.',
        display: false
    }
};

function updateAds(category) {
    console.log("Updating ads for category:", category);  // Debugging line

    // Handle AD1 and AD2
    ['ad1', 'ad2'].forEach(adId => {
        const adElement = document.getElementById(adId);
        const adData = adConfig[adId][category];

        console.log(`${adId} data:`, adData);  // Debugging line

        if (adData && adData.display) {
            adElement.style.display = 'block';
            
            switch (adData.type) {
                case 'pure-text':
                    adElement.innerHTML = `<p>${adData.content}</p>`;
                    break;
                case 'text-link':
                    adElement.innerHTML = `<a href="${adData.link}" target="_blank">${adData.content}</a>`;
                    break;
                case 'image-link':
                    adElement.innerHTML = `<a href="${adData.link}" target="_blank"><img src="${adData.imageUrl}" alt="Advertisement" style="max-width: 100%; height: auto;"></a>`;
                    break;
            }
        } else {
            adElement.style.display = 'none';
        }
    });

    // Handle AD3 and AD4
    ['ad3', 'ad4'].forEach(adId => {
        const adElement = document.getElementById(adId);
        const adData = adConfig[adId];

        console.log(`${adId} data:`, adData);  // Debugging line

        if (adData && adData.display) {
            adElement.style.display = 'block';
            
            switch (adData.type) {
                case 'pure-text':
                    adElement.innerHTML = `<p>${adData.content}</p>`;
                    break;
                case 'text-link':
                    adElement.innerHTML = `<a href="${adData.link}" target="_blank">${adData.content}</a>`;
                    break;
                case 'image-link':
                    adElement.innerHTML = `<a href="${adData.link}" target="_blank"><img src="${adData.imageUrl}" alt="Advertisement" style="max-width: 100%; height: auto;"></a>`;
                    break;
            }
        } else {
            adElement.style.display = 'none';
        }
    });
}
