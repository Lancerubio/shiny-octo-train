document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translationDirection = document.getElementById('translationDirection');
    const translateBtn = document.getElementById('translateBtn');
    const alertBox = document.getElementById('alertBox');
    const copyBtn = document.getElementById('copyBtn');
    const downloadTextBtn = document.getElementById('downloadTextBtn');
    const downloadImageBtn = document.getElementById('downloadImageBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Baybayin character mappings - Updated and complete
    const filipinoToBaybayin = {
        'a': 'ᜀ', 'e': 'ᜁ', 'i': 'ᜁ', 'o': 'ᜂ', 'u': 'ᜂ',
        'b': 'ᜊ', 'k': 'ᜃ', 'd': 'ᜇ', 'g': 'ᜄ', 'h': 'ᜑ',
        'l': 'ᜎ', 'm': 'ᜋ', 'n': 'ᜈ', 'ng': 'ᜅ', 'p': 'ᜉ',
        'r': 'ᜍ', 's': 'ᜐ', 't': 'ᜆ', 'w': 'ᜏ', 'y': 'ᜌ',
        'z': 'ᜐ',
        'i_kudlit': 'ᜒ', 'u_kudlit': 'ᜓ', 'virama': '᜔',
    };

    const baybayinToFilipino = {
        'ᜀ': 'a', 'ᜁ': 'i', 'ᜂ': 'u',
        'ᜃ': 'ka', 'ᜄ': 'ga', 'ᜅ': 'nga',
        'ᜆ': 'ta', 'ᜇ': 'da', 'ᜈ': 'na',
        'ᜉ': 'pa', 'ᜊ': 'ba', 'ᜋ': 'ma',
        'ᜌ': 'ya', 'ᜍ': 'ra', 'ᜎ': 'la',
        'ᜏ': 'wa', 'ᜐ': 'sa', 'ᜑ': 'ha',
        'ᜃᜒ': 'ki', 'ᜄᜒ': 'gi', 'ᜅᜒ': 'ngi',
        'ᜆᜒ': 'ti', 'ᜇᜒ': 'di', 'ᜈᜒ': 'ni',
        'ᜉᜒ': 'pi', 'ᜊᜒ': 'bi', 'ᜋᜒ': 'mi',
        'ᜌᜒ': 'yi', 'ᜍᜒ': 'ri', 'ᜎᜒ': 'li',
        'ᜏᜒ': 'wi', 'ᜐᜒ': 'si', 'ᜑᜒ': 'hi',
        'ᜃᜓ': 'ku', 'ᜄᜓ': 'gu', 'ᜅᜓ': 'ngu',
        'ᜆᜓ': 'tu', 'ᜇᜓ': 'du', 'ᜈᜓ': 'nu',
        'ᜉᜓ': 'pu', 'ᜊᜓ': 'bu', 'ᜋᜓ': 'mu',
        'ᜌᜓ': 'yu', 'ᜍᜓ': 'ru', 'ᜎᜓ': 'lu',
        'ᜏᜓ': 'wu', 'ᜐᜓ': 'su', 'ᜑᜓ': 'hu',
        'ᜃ᜔': 'k', 'ᜄ᜔': 'g', 'ᜅ᜔': 'ng',
        'ᜆ᜔': 't', 'ᜇ᜔': 'd', 'ᜈ᜔': 'n',
        'ᜉ᜔': 'p', 'ᜊ᜔': 'b', 'ᜋ᜔': 'm',
        'ᜌ᜔': 'y', 'ᜍ᜔': 'r', 'ᜎ᜔': 'l',
        'ᜏ᜔': 'w', 'ᜐ᜔': 's', 'ᜑ᜔': 'h',
        '᜔': ''
    };

    // Function to translate Filipino to Baybayin
    function translateFilipineToBaybayin(text) {
        let result = '';
        let hasUnsupportedChars = false;
        let i = 0;
        text = text.toLowerCase();

        while (i < text.length) {
            if (text[i] === 'n' && i + 1 < text.length && text[i + 1] === 'g') {
                const character = 'ng';
                if (i + 2 < text.length) {
                    const nextChar = text[i + 2];
                    if (nextChar === 'i' || nextChar === 'e') {
                        result += filipinoToBaybayin[character] + filipinoToBaybayin['i_kudlit'];
                        i += 3;
                    } else if (nextChar === 'o' || nextChar === 'u') {
                        result += filipinoToBaybayin[character] + filipinoToBaybayin['u_kudlit'];
                        i += 3;
                    } else if (nextChar === 'a') {
                        result += filipinoToBaybayin[character];
                        i += 3;
                    } else {
                        result += filipinoToBaybayin[character] + filipinoToBaybayin['virama'];
                        i += 2;
                    }
                } else {
                    result += filipinoToBaybayin[character] + filipinoToBaybayin['virama'];
                    i += 2;
                }
            } else {
                const char = text[i];
                if (/\s|[.,?!;:"'()[\]{}]/.test(char)) {
                    result += char;
                    i++;
                    continue;
                }
                if ('aeiou'.includes(char)) {
                    if (filipinoToBaybayin[char]) {
                        result += filipinoToBaybayin[char];
                    } else {
                        hasUnsupportedChars = true;
                        result += char;
                    }
                    i++;
                } else if (filipinoToBaybayin[char]) {
                    if (i + 1 < text.length) {
                        const nextChar = text[i + 1];
                        if (nextChar === 'i' || nextChar === 'e') {
                            result += filipinoToBaybayin[char] + filipinoToBaybayin['i_kudlit'];
                            i += 2;
                        } else if (nextChar === 'o' || nextChar === 'u') {
                            result += filipinoToBaybayin[char] + filipinoToBaybayin['u_kudlit'];
                            i += 2;
                        } else if (nextChar === 'a') {
                            result += filipinoToBaybayin[char];
                            i += 2;
                        } else {
                            result += filipinoToBaybayin[char] + filipinoToBaybayin['virama'];
                            i++;
                        }
                    } else {
                        result += filipinoToBaybayin[char] + filipinoToBaybayin['virama'];
                        i++;
                    }
                } else {
                    hasUnsupportedChars = true;
                    result += char;
                    i++;
                }
            }
        }
        return { result, hasUnsupportedChars };
    }

    // Function to translate Baybayin to Filipino
    function translateBaybayinToFilipino(text) {
        let result = '';
        let hasUnsupportedChars = false;
        let i = 0;

        while (i < text.length) {
            if (i + 1 < text.length && (text[i + 1] === 'ᜒ' || text[i + 1] === 'ᜓ' || text[i + 1] === '᜔')) {
                const twoChars = text[i] + text[i + 1];
                if (baybayinToFilipino[twoChars]) {
                    result += baybayinToFilipino[twoChars];
                    i += 2;
                } else {
                    hasUnsupportedChars = true;
                    result += twoChars;
                    i += 2;
                }
            } else {
                const char = text[i];
                if (/\s|[.,?!;:"'()[\]{}]/.test(char)) {
                    result += char;
                    i++;
                    continue;
                }
                if (baybayinToFilipino[char]) {
                    result += baybayinToFilipino[char];
                    i++;
                } else {
                    hasUnsupportedChars = true;
                    result += char;
                    i++;
                }
            }
        }
        return { result, hasUnsupportedChars };
    }

    // Event listener for the translate button
    translateBtn.addEventListener('click', function() {
        const text = inputText.value;
        const direction = translationDirection.value;

        if (!text.trim()) {
            outputText.innerHTML = '';
            alertBox.classList.add('d-none');
            return;
        }

        let translation;
        if (direction === 'filipino-to-baybayin') {
            translation = translateFilipineToBaybayin(text);
        } else {
            translation = translateBaybayinToFilipino(text);
        }

        if (direction === 'filipino-to-baybayin') {
            outputText.innerHTML = '';
            for (let i = 0; i < translation.result.length; i++) {
                const char = translation.result[i];
                if (/[\s\p{P}]/u.test(char)) {
                    outputText.innerHTML += char;
                } else {
                    const span = document.createElement('span');
                    span.className = 'baybayin-char';
                    span.textContent = char;
                    outputText.appendChild(span);
                }
            }
        } else {
            outputText.textContent = translation.result;
        }

        if (translation.hasUnsupportedChars) {
            alertBox.classList.remove('d-none');
        } else {
            alertBox.classList.add('d-none');
        }
    });

    // Copy button functionality
    copyBtn.addEventListener('click', function() {
        const text = outputText.textContent;
        navigator.clipboard.writeText(text).then(function() {
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            outputText.classList.add('copied');
            setTimeout(function() {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                outputText.classList.remove('copied');
            }, 1500);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });

    // Download as text
    downloadTextBtn.addEventListener('click', function() {
        const text = outputText.textContent;
        if (!text.trim()) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'baybayin-translation.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Download as image
    downloadImageBtn.addEventListener('click', function() {
        const text = outputText.textContent;
        if (!text.trim()) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 400;

        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#343a40' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxWidth = 700;
        const lineHeight = 50;
        const words = text.split(' ');
        let line = '';
        let y = 80;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, canvas.width / 2, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, canvas.width / 2, y);

        ctx.font = '14px Arial';
        ctx.fillText('Generated by BaybayinPH', canvas.width / 2, canvas.height - 20);

        const image = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = image;
        a.download = 'baybayin-translation.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Light Mode';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Toggle Dark Mode';
        }
    });

    // Input event listener for real-time translation
    inputText.addEventListener('input', function() {
        if (inputText.value.trim() === '') {
            outputText.innerHTML = '';
            alertBox.classList.add('d-none');
        }
    });

    // Lessons Section: Collapsible Functionality
    const lessonItems = document.querySelectorAll('#lessons .lesson-item');
    lessonItems.forEach(item => {
        const header = item.querySelector('h3');
        const content = item.querySelector('p');
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                header.innerHTML = header.textContent + ' <i class="fas fa-chevron-up"></i>';
            } else {
                content.style.display = 'none';
                header.innerHTML = header.textContent.replace(' <i class="fas fa-chevron-up"></i>', '') + ' <i class="fas fa-chevron-down"></i>';
            }
        });
        // Initially collapse
        content.style.display = 'none';
        header.innerHTML += ' <i class="fas fa-chevron-down"></i>';
    });

    // Quiz Section: Interactive Quiz Functionality
    const quizItems = document.querySelectorAll('#quiz .quiz-item');
    const quizAnswers = {
        'Quiz 1': ['ba', 'ka', 'ma'],
        'Quiz 2': 'ᜋᜑᜎ᜔',
        'Quiz 3': 'salamat'
    };

    quizItems.forEach(item => {
        const header = item.querySelector('h3');
        const question = item.querySelector('p');
        const quizNum = header.textContent.split(':')[0].trim();

        // Add input and button
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mt-2';
        input.placeholder = 'Enter your answer here';

        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-primary mt-2';
        checkBtn.textContent = 'Check Answer';

        const feedback = document.createElement('p');
        feedback.className = 'mt-2';
        feedback.style.display = 'none';

        item.appendChild(input);
        item.appendChild(checkBtn);
        item.appendChild(feedback);

        checkBtn.addEventListener('click', function() {
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = quizAnswers[quizNum];
            if (Array.isArray(correctAnswer)) {
                const userAnswers = userAnswer.split(',').map(a => a.trim());
                const isCorrect = userAnswers.length === correctAnswer.length &&
                    userAnswers.every((ans, idx) => ans === correctAnswer[idx]);
                feedback.textContent = isCorrect ? 'Correct!' : `Incorrect. Correct answers: ${correctAnswer.join(', ')}`;
            } else {
                feedback.textContent = userAnswer === correctAnswer ? 'Correct!' : `Incorrect. Correct answer: ${correctAnswer}`;
            }
            feedback.style.display = 'block';
            feedback.style.color = feedback.textContent === 'Correct!' ? '#28a745' : '#dc3545';
        });
    });

    // About Section: Team Roles Highlight and Email Copy
    const aboutSection = document.getElementById('about');
    const aboutParagraphs = aboutSection.querySelectorAll('p');
    aboutParagraphs[1].innerHTML = 'As students, we’re learning and growing while building this tool, aiming to educate others about Filipino history and language. Our team consists of <span class="team-role">programmers</span>, <span class="team-role">designers</span>, and <span class="team-role">language enthusiasts</span> working together to promote Baybayin in the digital age.';
    
    const teamRoles = aboutSection.querySelectorAll('.team-role');
    teamRoles.forEach(role => {
        role.style.cursor = 'pointer';
        role.addEventListener('mouseover', function() {
            role.style.backgroundColor = '#0d6efd';
            role.style.color = '#fff';
            role.style.padding = '2px 5px';
            role.style.borderRadius = '3px';
        });
        role.addEventListener('mouseout', function() {
            role.style.backgroundColor = '';
            role.style.color = '';
            role.style.padding = '';
            role.style.borderRadius = '';
        });
    });

    const emailParagraph = aboutParagraphs[2];
    emailParagraph.style.cursor = 'pointer';
    emailParagraph.addEventListener('click', function() {
        const email = 'baybayinph.team@gmail.com';
        navigator.clipboard.writeText(email).then(function() {
            emailParagraph.textContent = 'Email copied to clipboard!';
            setTimeout(() => {
                emailParagraph.textContent = 'Contact us at: baybayinph.team@gmail.com';
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy email: ', err);
        });
    });
});