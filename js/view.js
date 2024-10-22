document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    const profileInfo = document.getElementById('profile-info');
    const shareButton = document.getElementById('share-button');
    const qrButton = document.getElementById('qr-button');
    
    // If the URL has a profile ID, load it automatically
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
    if (profileId) {
        loadProfile(profileId);
    }

    // Main profile loading function
    window.loadProfile = function(userId) {
        if (!profileInfo) {
            console.error('Profile info element not found');
            return;
        }

        console.log("Loading profile for userId:", userId);

        if (!userId) {
            profileInfo.innerHTML = '<p>No user ID provided.</p>';
            return;
        }

        try {
            const decodedData = decodeProfileData(userId);
            console.log("Decoded data:", decodedData);

            if (typeof decodedData !== 'object' || decodedData === null) {
                throw new Error('Decoded data is not an object');
            }

        // Clear previous profile data
        profileInfo.innerHTML = '';

        // Create profile header with avatar
        const header = document.createElement('div');
        header.className = 'profile-header';
        
        // Generate avatar using Libravatar
        const avatar = document.createElement('img');
        if (decodedData.email) {
            // Generate MD5 hash of email for Libravatar
            const emailHash = md5(decodedData.email.trim().toLowerCase());
            // Use Libravatar with fallback to default avatar
            avatar.src = `https://seccdn.libravatar.org/avatar/${emailHash}?s=128&d=identicon`;
        } else {
            // Use default avatar if no email is provided
            avatar.src = 'https://seccdn.libravatar.org/avatar/?s=128&d=identicon';
        }
        avatar.className = 'profile-avatar';
        avatar.alt = 'Profile Avatar';
        header.appendChild(avatar);

        // Add name and bio section
        if (decodedData.name || decodedData.surname) {
            const nameDiv = document.createElement('div');
            nameDiv.className = 'profile-name';
            const sanitizedName = sanitizeText(`${decodedData.name || ''} ${decodedData.surname || ''}`);
            nameDiv.textContent = sanitizedName.trim();
            header.appendChild(nameDiv);
        }

        if (decodedData.bio) {
            const bioDiv = document.createElement('div');
            bioDiv.className = 'profile-bio';
            bioDiv.textContent = sanitizeText(decodedData.bio);
            header.appendChild(bioDiv);
        }

        profileInfo.appendChild(header);

        // Create sections for different types of information
        const sections = {
            personal: ['pronouns', 'gender', 'email', 'phone', 'website'],
            security: ['GPG', 'keyoxide'],
            social: ['GitHub', 'GitLab', 'git', 'StackOverflow', 'discord', 'instagram', 'twitter', 'facebook', 'YouTube', 'LinkTag', 'pronouns.cc']
        };

        const iconMap = {
            name: 'fas fa-user',
            surname: 'fas fa-user-check',
            bio: 'fas fa-book',
            pronouns: 'fas fa-user-tag',
            gender: 'fas fa-venus-mars',
            email: 'fas fa-envelope',
            phone: 'fas fa-phone',
            website: 'fas fa-globe',
            GPG: 'fas fa-key',
            GitHub: 'fab fa-github',
            GitLab: 'fab fa-gitlab',
            git: 'fab fa-git',
            StackOverflow: 'fab fa-stack-overflow',
            keyoxide: 'fas fa-key',
            discord: 'fab fa-discord',
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-twitter',
            facebook: 'fab fa-facebook',
            YouTube: 'fab fa-youtube',
            LinkTag: 'fas fa-tag',
            pronounscc: 'fas fa-user-tag'
        };

        // Create sections
        Object.entries(sections).forEach(([sectionName, fields]) => {
            const sectionData = fields.filter(field => decodedData[field]);
            if (sectionData.length > 0) {
                const section = document.createElement('div');
                section.className = 'profile-section';
                
                const sectionTitle = document.createElement('h3');
                sectionTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
                section.appendChild(sectionTitle);

                sectionData.forEach(field => {
                    const div = document.createElement('div');
                    div.className = 'profile-item';
                    
                    const icon = document.createElement('i');
                    icon.className = iconMap[field] || 'fas fa-info-circle';
                    div.appendChild(icon);
                    
                    const content = document.createElement('span');
                    const value = sanitizeText(decodedData[field]);
                    
                    // Make links clickable with proper sanitization
                    if (field === 'email') {
                        const sanitizedEmail = sanitizeEmail(value);
                        if (sanitizedEmail) {
                            content.innerHTML = `<a href="mailto:${sanitizedEmail}" target="_blank">${sanitizedEmail}</a>`;
                        } else {
                            content.textContent = 'Invalid email';
                        }
                    } else if (field === 'phone') {
                        const sanitizedPhone = sanitizePhone(value);
                        if (sanitizedPhone) {
                            content.innerHTML = `<a href="tel:${sanitizedPhone}">${sanitizedPhone}</a>`;
                        } else {
                            content.textContent = 'Invalid phone number';
                        }
                    } else if (isValidUrl(value)) {
                        const sanitizedUrl = sanitizeUrl(value);
                        content.innerHTML = `<a href="${sanitizedUrl}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                    } else {
                        content.textContent = value;
                    }
                    
                    div.appendChild(content);
                    section.appendChild(div);
                });

                profileInfo.appendChild(section);
            }
        });

        // Add copy button for profile ID
        const copyButton = document.createElement('button');
        copyButton.className = 'action-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Profile ID';
        copyButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(userId);
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Profile ID';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                // Fallback for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = userId;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Profile ID';
                }, 2000);
            }
        };
        profileInfo.appendChild(copyButton);

        // Add last updated timestamp instead of verification
        const timestamp = document.createElement('div');
        timestamp.className = 'profile-timestamp';
        timestamp.innerHTML = `<i class="fas fa-clock"></i> Last viewed: ${new Date().toLocaleString()}`;
        profileInfo.appendChild(timestamp);

        if (profileInfo.children.length === 0) {
            profileInfo.innerHTML = '<p>No valid profile data found.</p>';
        }

        // Enable share button functionality
        if (shareButton) {
            shareButton.style.display = 'inline-block';
            shareButton.onclick = async () => {
                try {
                    const shareUrl = window.location.href;
                    if (navigator.share) {
                        await navigator.share({
                            title: 'OpenProfile Card',
                            text: `Check out this OpenProfile card!`,
                            url: shareUrl
                        });
                    } else {
                        await navigator.clipboard.writeText(shareUrl);
                        alert('Profile URL copied to clipboard!');
                    }
                } catch (err) {
                    console.error('Error sharing:', err);
                    // Fallback for clipboard
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = window.location.href;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Profile URL copied to clipboard!');
                    } catch (clipboardErr) {
                        console.error('Clipboard fallback failed:', clipboardErr);
                        alert('Unable to share or copy profile URL');
                    }
                }
            };
        }

        if (qrButton) {
            qrButton.style.display = 'inline-block';
            qrButton.onclick = async () => {
                // Remove any existing QR modals
                document.querySelectorAll('.qr-modal').forEach(modal => modal.remove());
                
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;
                const qrModal = document.createElement('div');
                qrModal.className = 'qr-modal';
                
                try {
                    // Check if QR code generation is successful
                    const response = await fetch(qrUrl);
                    if (!response.ok) throw new Error('QR code generation failed');
                    
                    qrModal.innerHTML = `
                        <div class="qr-modal-content">
                            <span class="qr-close">&times;</span>
                            <img src="${qrUrl}" alt="Profile QR Code" onerror="this.onerror=null;this.src='error-qr.png';">
                            <p>Scan this QR code to view the profile</p>
                        </div>
                    `;
                } catch (error) {
                    console.error('Error generating QR code:', error);
                    qrModal.innerHTML = `
                        <div class="qr-modal-content">
                            <span class="qr-close">&times;</span>
                            <p>Failed to generate QR code. Please try again later.</p>
                        </div>
                    `;
                }
                
                document.body.appendChild(qrModal);
                
                const closeModal = () => qrModal.remove();
                qrModal.querySelector('.qr-close').onclick = closeModal;
                qrModal.onclick = (e) => {
                    if (e.target === qrModal) closeModal();
                };
            };
        }

    } catch (error) {
        console.error('Error loading profile:', error);
        profileInfo.innerHTML = '<p>Error loading profile data. Please try again.</p>';
    }
};

// Helper function to check if elements exist
function checkElements() {
    const missing = [];
    if (!profileInfo) missing.push('profile-info');
    if (!shareButton) missing.push('share-button');
    if (!qrButton) missing.push('qr-button');
    
    if (missing.length > 0) {
        console.warn('Missing DOM elements:', missing.join(', '));
    }
}

// Run check in development environment
if (process.env.NODE_ENV !== 'production') {
    checkElements();
}
});

// Helper functions for sanitization
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent;
}

function sanitizeEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? email : null;
}

function sanitizePhone(phone) {
    const phoneRegex = /^[\d\s()+\-]+$/;
    return phoneRegex.test(phone) ? phone : null;
}

function sanitizeUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}