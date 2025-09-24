// NLP Phases Interactive Application
class NLPApp {
    constructor() {
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCodeTabs();
        this.setupPhaseCards();
        this.initializePrism();
    }

    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav__tab');
        const sections = document.querySelectorAll('.section');

        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab, navTabs, sections);
            });
        });
    }

    switchTab(targetTab, navTabs, sections) {
        // Update navigation
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === targetTab);
        });

        // Update sections
        sections.forEach(section => {
            section.classList.toggle('active', section.id === targetTab);
        });

        this.currentTab = targetTab;
        
        // Re-highlight code after tab switch
        setTimeout(() => {
            if (window.Prism) {
                window.Prism.highlightAll();
            }
        }, 100);
    }

    setupCodeTabs() {
        const codeTabContainers = document.querySelectorAll('.code-tabs');
        
        codeTabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.code-tab');
            const blocks = container.parentElement.querySelectorAll('.code-block');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetCode = tab.dataset.code;
                    
                    // Update tabs
                    tabs.forEach(t => t.classList.toggle('active', t === tab));
                    
                    // Update code blocks
                    blocks.forEach(block => {
                        block.classList.toggle('active', block.id === targetCode);
                    });

                    // Re-highlight code
                    setTimeout(() => {
                        if (window.Prism) {
                            window.Prism.highlightAll();
                        }
                    }, 50);
                });
            });
        });
    }

    setupPhaseCards() {
        const phaseCards = document.querySelectorAll('.phase-card');
        const navTabs = document.querySelectorAll('.nav__tab');
        const sections = document.querySelectorAll('.section');

        phaseCards.forEach(card => {
            card.addEventListener('click', () => {
                const phase = card.dataset.phase;
                this.switchTab(phase, navTabs, sections);
            });
        });
    }

    initializePrism() {
        // Ensure Prism is loaded and highlight code
        const checkPrism = () => {
            if (window.Prism) {
                window.Prism.highlightAll();
            } else {
                setTimeout(checkPrism, 100);
            }
        };
        checkPrism();
    }

    // Utility method to show loading state
    showLoading(outputElement) {
        outputElement.classList.add('loading');
        outputElement.textContent = '';
    }

    // Utility method to hide loading state
    hideLoading(outputElement) {
        outputElement.classList.remove('loading');
    }

    // Utility method to simulate processing delay
    async simulateProcessing(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Mock NLP Processing Functions
class MockNLPProcessor {
    // Morphological Analysis
    static stem(words) {
        const stemMap = {
            'running': 'run',
            'runs': 'run',
            'ran': 'ran',
            'better': 'better',
            'good': 'good',
            'mice': 'mice',
            'easily': 'easili',
            'fairly': 'fairli',
            'jumping': 'jump',
            'jumped': 'jump',
            'eating': 'eat',
            'eaten': 'eaten',
            'quickly': 'quickli',
            'walking': 'walk',
            'walked': 'walk'
        };
        
        return words.map(word => ({
            original: word.trim(),
            stemmed: stemMap[word.trim().toLowerCase()] || word.trim().toLowerCase()
        }));
    }

    static lemmatize(words) {
        const lemmaMap = {
            'running': 'run',
            'runs': 'run',
            'ran': 'run',
            'better': 'good',
            'good': 'good',
            'mice': 'mouse',
            'easily': 'easily',
            'fairly': 'fairly',
            'jumping': 'jump',
            'jumped': 'jump',
            'eating': 'eat',
            'eaten': 'eat',
            'quickly': 'quickly',
            'walking': 'walk',
            'walked': 'walk',
            'children': 'child',
            'feet': 'foot',
            'teeth': 'tooth'
        };
        
        return words.map(word => ({
            original: word.trim(),
            lemma: lemmaMap[word.trim().toLowerCase()] || word.trim().toLowerCase()
        }));
    }

    // Lexical Analysis
    static tokenize(text) {
        // Simple tokenization with some smart splitting
        const tokens = text.split(/(\s+|[.,!?;:]|[$]\d+|\d+)/).filter(token => token.trim());
        return tokens.map((token, index) => ({
            text: token,
            position: index
        }));
    }

    static posTag(text) {
        const words = text.split(/\s+/);
        const posMap = {
            'the': 'DT', 'a': 'DT', 'an': 'DT',
            'quick': 'JJ', 'brown': 'JJ', 'big': 'JJ', 'small': 'JJ', 'good': 'JJ', 'bad': 'JJ',
            'fox': 'NN', 'cat': 'NN', 'dog': 'NN', 'house': 'NN', 'car': 'NN', 'book': 'NN',
            'jumps': 'VBZ', 'runs': 'VBZ', 'walks': 'VBZ', 'sits': 'VBZ', 'stands': 'VBZ',
            'jumped': 'VBD', 'ran': 'VBD', 'walked': 'VBD', 'sat': 'VBD',
            'over': 'IN', 'under': 'IN', 'on': 'IN', 'in': 'IN', 'at': 'IN',
            'and': 'CC', 'but': 'CC', 'or': 'CC',
            'i': 'PRP', 'you': 'PRP', 'he': 'PRP', 'she': 'PRP', 'it': 'PRP',
            'is': 'VBZ', 'are': 'VBP', 'was': 'VBD', 'were': 'VBD',
            'john': 'NNP', 'mary': 'NNP', 'london': 'NNP', 'apple': 'NNP'
        };

        return words.map(word => ({
            word: word,
            pos: posMap[word.toLowerCase()] || 'NN'
        }));
    }

    // Syntactic Analysis
    static dependencyParse(text) {
        const words = text.toLowerCase().split(/\s+/);
        const dependencies = [];
        
        // Simple rule-based dependency parsing
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let dep = 'ROOT';
            let head = word;
            
            if (word === 'the' || word === 'a' || word === 'an') {
                dep = 'det';
                head = words[i + 1] || word;
            } else if (word.endsWith('ing') || word.endsWith('s') || word.endsWith('ed')) {
                dep = 'ROOT';
                head = word;
            } else if (i > 0 && (words[i-1] === 'the' || words[i-1] === 'a')) {
                dep = 'nsubj';
                head = words.find(w => w.endsWith('s') || w.endsWith('ed')) || word;
            } else if (word === 'on' || word === 'in' || word === 'at' || word === 'over') {
                dep = 'prep';
                head = words[i - 1] || word;
            } else if (i > 0 && (words[i-1] === 'on' || words[i-1] === 'in')) {
                dep = 'pobj';
                head = words[i - 1];
            }
            
            dependencies.push({
                word: word,
                dependency: dep,
                head: head
            });
        }
        
        return dependencies;
    }

    static parseTree(text) {
        const words = text.split(/\s+/);
        // Simple constituency parsing simulation
        if (words.length === 3 && words[1].toLowerCase() === 'loves') {
            return `[S [NP ${words[0]}] [VP [V ${words[1]}] [NP ${words[2]}]]]`;
        } else if (words.length >= 4) {
            const subject = words.slice(0, 2).join(' ');
            const predicate = words.slice(2).join(' ');
            return `[S [NP ${subject}] [VP ${predicate}]]`;
        }
        return `[S ${words.join(' ')}]`;
    }

    // Semantic Analysis
    static namedEntityRecognition(text) {
        const entities = [];
        const personNames = ['barack', 'obama', 'john', 'mary', 'alice', 'bob', 'smith', 'johnson'];
        const locations = ['hawaii', 'california', 'london', 'paris', 'tokyo', 'new york', 'washington'];
        const organizations = ['apple', 'google', 'microsoft', 'facebook', 'amazon', 'netflix'];
        
        const words = text.toLowerCase().split(/\s+/);
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (personNames.includes(word)) {
                entities.push({
                    text: text.split(/\s+/)[i],
                    label: 'PERSON',
                    start: i,
                    end: i + 1
                });
            } else if (locations.includes(word)) {
                entities.push({
                    text: text.split(/\s+/)[i],
                    label: 'GPE',
                    start: i,
                    end: i + 1
                });
            } else if (organizations.includes(word)) {
                entities.push({
                    text: text.split(/\s+/)[i],
                    label: 'ORG',
                    start: i,
                    end: i + 1
                });
            }
        }
        
        return entities;
    }

    static wordSenseDisambiguation(text) {
        const senseMap = {
            'bank': {
                context: ['money', 'deposit', 'account', 'financial'],
                sense: 'financial institution',
                definition: 'A financial establishment that invests money deposited by customers'
            },
            'bark': {
                context: ['dog', 'animal', 'sound'],
                sense: 'dog sound',
                definition: 'The sound made by a dog'
            },
            'bass': {
                context: ['fish', 'water', 'fishing'],
                sense: 'fish',
                definition: 'A type of fish found in freshwater and marine environments'
            }
        };
        
        const words = text.toLowerCase().split(/\s+/);
        const results = [];
        
        words.forEach(word => {
            if (senseMap[word]) {
                const hasContext = senseMap[word].context.some(ctx => text.toLowerCase().includes(ctx));
                if (hasContext) {
                    results.push({
                        word: word,
                        sense: senseMap[word].sense,
                        definition: senseMap[word].definition,
                        confidence: 0.85
                    });
                }
            }
        });
        
        return results;
    }

    // Pragmatic Analysis
    static intentRecognition(text) {
        const textLower = text.toLowerCase();
        
        if (/can you|could you|would you|please/.test(textLower)) {
            return {
                intent: 'REQUEST',
                confidence: 0.92,
                explanation: 'Polite request pattern detected'
            };
        } else if (/what|where|when|how|why|who/.test(textLower)) {
            return {
                intent: 'QUESTION',
                confidence: 0.88,
                explanation: 'Interrogative word detected'
            };
        } else if (/hello|hi|hey|good morning|good afternoon/.test(textLower)) {
            return {
                intent: 'GREETING',
                confidence: 0.95,
                explanation: 'Greeting phrase detected'
            };
        } else if (/thank you|thanks|appreciate/.test(textLower)) {
            return {
                intent: 'GRATITUDE',
                confidence: 0.90,
                explanation: 'Gratitude expression detected'
            };
        } else {
            return {
                intent: 'STATEMENT',
                confidence: 0.70,
                explanation: 'Default classification for declarative sentence'
            };
        }
    }

    static contextAnalysis(text) {
        const textLower = text.toLowerCase();
        const analysis = {
            literal_meaning: text,
            pragmatic_meaning: null,
            speech_act: null,
            implicature: null
        };
        
        if (text.includes('?')) {
            if (/can you|could you|would you/.test(textLower)) {
                analysis.speech_act = 'REQUEST';
                analysis.pragmatic_meaning = 'Polite request for action';
                analysis.implicature = 'Speaker wants the listener to perform an action';
            } else {
                analysis.speech_act = 'QUESTION';
                analysis.pragmatic_meaning = 'Information seeking';
                analysis.implicature = 'Speaker wants information from listener';
            }
        } else if (/it\'s|this is/.test(textLower)) {
            analysis.speech_act = 'ASSERTION';
            if (/cold|hot|warm|cool/.test(textLower)) {
                analysis.pragmatic_meaning = 'Indirect request to adjust temperature';
                analysis.implicature = 'Speaker wants temperature to be changed';
            } else {
                analysis.pragmatic_meaning = 'Statement of fact or opinion';
            }
        }
        
        return analysis;
    }

    // Discourse Integration
    static coreferenceResolution(text) {
        const sentences = text.split('.').map(s => s.trim()).filter(s => s);
        const chains = {};
        const entities = ['john', 'alice', 'mary', 'bob', 'sarah', 'mike'];
        const pronouns = ['he', 'she', 'it', 'they', 'him', 'her', 'them', 'his', 'hers', 'its', 'their'];
        
        let currentEntity = null;
        
        sentences.forEach((sentence, sentIndex) => {
            const words = sentence.toLowerCase().split(/\s+/);
            
            // Find entities in this sentence
            words.forEach(word => {
                if (entities.includes(word)) {
                    currentEntity = word;
                    if (!chains[currentEntity]) {
                        chains[currentEntity] = [];
                    }
                    chains[currentEntity].push({
                        mention: sentence.split(/\s+/).find(w => w.toLowerCase() === word),
                        sentence: sentIndex + 1,
                        type: 'proper_noun'
                    });
                }
            });
            
            // Find pronouns and link to current entity
            words.forEach(word => {
                if (pronouns.includes(word) && currentEntity) {
                    chains[currentEntity].push({
                        mention: word,
                        sentence: sentIndex + 1,
                        type: 'pronoun'
                    });
                }
            });
            
            // Handle common nouns that might refer to previous entities
            if (/groceries|food|items/.test(sentence.toLowerCase()) && text.toLowerCase().includes('milk') && text.toLowerCase().includes('bread')) {
                if (!chains['groceries']) {
                    chains['groceries'] = [];
                }
                chains['groceries'].push({
                    mention: 'groceries',
                    sentence: sentIndex + 1,
                    type: 'common_noun'
                });
                chains['groceries'].push({
                    mention: 'milk and bread',
                    sentence: sentences.findIndex(s => s.toLowerCase().includes('milk')) + 1,
                    type: 'items'
                });
            }
        });
        
        return chains;
    }

    static coherenceAnalysis(text) {
        const sentences = text.split('.').map(s => s.trim()).filter(s => s);
        const coherenceScores = [];
        
        // Simple coherence scoring based on word overlap and semantic similarity
        for (let i = 0; i < sentences.length - 1; i++) {
            const sent1 = sentences[i].toLowerCase().split(/\s+/);
            const sent2 = sentences[i + 1].toLowerCase().split(/\s+/);
            
            // Calculate word overlap
            const overlap = sent1.filter(word => sent2.includes(word)).length;
            const maxLength = Math.max(sent1.length, sent2.length);
            const overlapScore = overlap / maxLength;
            
            // Add semantic similarity heuristics
            let semanticScore = 0;
            const semanticPairs = [
                ['john', 'he'], ['alice', 'she'], ['mary', 'she'],
                ['store', 'shop'], ['bought', 'purchased'], ['expensive', 'costly'],
                ['milk', 'groceries'], ['bread', 'groceries'], ['programming', 'coding'],
                ['company', 'business'], ['profits', 'money'], ['stock', 'shares']
            ];
            
            semanticPairs.forEach(([word1, word2]) => {
                if ((sent1.includes(word1) && sent2.includes(word2)) || 
                    (sent1.includes(word2) && sent2.includes(word1))) {
                    semanticScore += 0.3;
                }
            });
            
            const finalScore = Math.min((overlapScore + semanticScore), 1.0);
            
            coherenceScores.push({
                sentence1: i + 1,
                sentence2: i + 2,
                score: parseFloat(finalScore.toFixed(3)),
                text1: sentences[i],
                text2: sentences[i + 1]
            });
        }
        
        const averageCoherence = coherenceScores.reduce((sum, item) => sum + item.score, 0) / coherenceScores.length;
        
        return {
            scores: coherenceScores,
            average: parseFloat(averageCoherence.toFixed(3)),
            sentences: sentences
        };
    }

    static discourseSegmentation(text) {
        const sentences = text.split('.').map(s => s.trim()).filter(s => s);
        const segments = [];
        
        // Simple rule-based segmentation
        let currentSegment = {
            sentences: [],
            topic: '',
            startIndex: 0
        };
        
        sentences.forEach((sentence, index) => {
            const sentenceLower = sentence.toLowerCase();
            
            // Topic shift indicators
            const topicShifts = [
                'however', 'but', 'meanwhile', 'on the other hand', 'in contrast',
                'furthermore', 'moreover', 'additionally', 'next', 'then'
            ];
            
            const hasTopicShift = topicShifts.some(indicator => sentenceLower.includes(indicator));
            
            if (hasTopicShift && currentSegment.sentences.length > 0) {
                // Finalize current segment
                segments.push({...currentSegment});
                
                // Start new segment
                currentSegment = {
                    sentences: [sentence],
                    topic: this.extractTopic(sentence),
                    startIndex: index
                };
            } else {
                currentSegment.sentences.push(sentence);
                if (currentSegment.topic === '') {
                    currentSegment.topic = this.extractTopic(sentence);
                }
            }
        });
        
        // Add the last segment
        if (currentSegment.sentences.length > 0) {
            segments.push(currentSegment);
        }
        
        return segments;
    }

    static extractTopic(sentence) {
        const sentenceLower = sentence.toLowerCase();
        
        if (sentenceLower.includes('profit') || sentenceLower.includes('money') || sentenceLower.includes('financial')) {
            return 'Finance';
        } else if (sentenceLower.includes('stock') || sentenceLower.includes('market') || sentenceLower.includes('shares')) {
            return 'Market';
        } else if (sentenceLower.includes('layoff') || sentenceLower.includes('job') || sentenceLower.includes('employment')) {
            return 'Employment';
        } else if (sentenceLower.includes('store') || sentenceLower.includes('shop') || sentenceLower.includes('buy')) {
            return 'Shopping';
        } else if (sentenceLower.includes('programming') || sentenceLower.includes('code') || sentenceLower.includes('software')) {
            return 'Technology';
        } else if (sentenceLower.includes('food') || sentenceLower.includes('groceries') || sentenceLower.includes('milk') || sentenceLower.includes('bread')) {
            return 'Food';
        } else {
            return 'General';
        }
    }
}

// Demo Functions
async function runStemming() {
    const input = document.getElementById('morphological-input').value;
    const output = document.getElementById('morphological-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(800);
    
    const words = input.split(',').map(w => w.trim());
    const results = MockNLPProcessor.stem(words);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Stemming Results:</h4>';
    
    results.forEach(result => {
        resultHTML += `
            <div class="result-item">
                <span class="result-word">${result.original}</span>
                <span class="result-tag">${result.stemmed}</span>
            </div>
        `;
    });
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runLemmatization() {
    const input = document.getElementById('morphological-input').value;
    const output = document.getElementById('morphological-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(800);
    
    const words = input.split(',').map(w => w.trim());
    const results = MockNLPProcessor.lemmatize(words);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Lemmatization Results:</h4>';
    
    results.forEach(result => {
        resultHTML += `
            <div class="result-item">
                <span class="result-word">${result.original}</span>
                <span class="result-tag">${result.lemma}</span>
            </div>
        `;
    });
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runTokenization() {
    const input = document.getElementById('lexical-input').value;
    const output = document.getElementById('lexical-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(600);
    
    const tokens = MockNLPProcessor.tokenize(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Tokenization Results:</h4>';
    resultHTML += '<div style="display: flex; flex-wrap: wrap; gap: 6px;">';
    
    tokens.forEach((token, index) => {
        if (token.text.trim()) {
            resultHTML += `<span class="result-tag">${token.text}</span>`;
        }
    });
    
    resultHTML += '</div></div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runPOSTagging() {
    const input = document.getElementById('lexical-input').value;
    const output = document.getElementById('lexical-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(700);
    
    const posTags = MockNLPProcessor.posTag(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">POS Tagging Results:</h4>';
    
    posTags.forEach(tag => {
        resultHTML += `
            <div class="result-item">
                <span class="result-word">${tag.word}</span>
                <span class="result-tag">${tag.pos}</span>
            </div>
        `;
    });
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runDependencyParsing() {
    const input = document.getElementById('syntactic-input').value;
    const output = document.getElementById('syntactic-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(900);
    
    const dependencies = MockNLPProcessor.dependencyParse(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Dependency Parsing Results:</h4>';
    
    dependencies.forEach(dep => {
        resultHTML += `
            <div class="result-dependency">
                <strong>${dep.word}</strong> → ${dep.dependency} → <em>${dep.head}</em>
            </div>
        `;
    });
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runParseTree() {
    const input = document.getElementById('syntactic-input').value;
    const output = document.getElementById('syntactic-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(1000);
    
    const parseTree = MockNLPProcessor.parseTree(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Parse Tree Results:</h4>';
    resultHTML += `<div class="result-dependency" style="font-family: var(--font-family-mono);">${parseTree}</div>`;
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runNER() {
    const input = document.getElementById('semantic-input').value;
    const output = document.getElementById('semantic-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(800);
    
    const entities = MockNLPProcessor.namedEntityRecognition(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Named Entity Recognition Results:</h4>';
    
    if (entities.length > 0) {
        entities.forEach(entity => {
            resultHTML += `
                <div class="result-item">
                    <span class="entity-highlight">
                        ${entity.text}
                        <span class="entity-label">${entity.label}</span>
                    </span>
                </div>
            `;
        });
    } else {
        resultHTML += '<p style="color: var(--color-text-secondary); font-style: italic;">No named entities found. Try using names like "Barack Obama" or places like "Hawaii".</p>';
    }
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runWSD() {
    const input = document.getElementById('semantic-input').value;
    const output = document.getElementById('semantic-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(1100);
    
    const wsdResults = MockNLPProcessor.wordSenseDisambiguation(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Word Sense Disambiguation Results:</h4>';
    
    if (wsdResults.length > 0) {
        wsdResults.forEach(result => {
            resultHTML += `
                <div class="result-item" style="flex-direction: column; align-items: flex-start;">
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 8px;">
                        <span class="result-word">${result.word}</span>
                        <span class="result-tag">Confidence: ${(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                        <strong>Sense:</strong> ${result.sense}<br>
                        <strong>Definition:</strong> ${result.definition}
                    </div>
                </div>
            `;
        });
    } else {
        resultHTML += '<p style="color: var(--color-text-secondary); font-style: italic;">No ambiguous words found. Try using words like "bank", "bark", or "bass" in context.</p>';
    }
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runIntentRecognition() {
    const input = document.getElementById('pragmatic-input').value;
    const output = document.getElementById('pragmatic-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(700);
    
    const intent = MockNLPProcessor.intentRecognition(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Intent Recognition Results:</h4>';
    resultHTML += `
        <div class="intent-result">
            <div class="intent-label">Intent: ${intent.intent}</div>
            <div style="color: var(--color-text-secondary); margin-bottom: 8px;">
                Confidence: ${(intent.confidence * 100).toFixed(0)}%
            </div>
            <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
                ${intent.explanation}
            </div>
        </div>
    `;
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runContextAnalysis() {
    const input = document.getElementById('pragmatic-input').value;
    const output = document.getElementById('pragmatic-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(900);
    
    const analysis = MockNLPProcessor.contextAnalysis(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 12px; color: var(--color-text);">Context Analysis Results:</h4>';
    resultHTML += '<div class="context-analysis">';
    
    Object.entries(analysis).forEach(([key, value]) => {
        if (value !== null) {
            const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            resultHTML += `
                <div class="analysis-row">
                    <span class="analysis-key">${displayKey}:</span>
                    <span class="analysis-value">${value}</span>
                </div>
            `;
        }
    });
    
    resultHTML += '</div></div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

// Discourse Integration Demo Functions
async function runCoreferenceResolution() {
    const input = document.getElementById('discourse-input').value;
    const output = document.getElementById('discourse-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(1200);
    
    const chains = MockNLPProcessor.coreferenceResolution(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 16px; color: var(--color-text);">Coreference Resolution Results:</h4>';
    
    Object.entries(chains).forEach(([entity, mentions]) => {
        resultHTML += `
            <div class="coreference-chain">
                <div class="coreference-entity">${entity.toUpperCase()}</div>
                <div class="coreference-mentions">
        `;
        
        mentions.forEach(mention => {
            resultHTML += `
                <span class="mention-tag" title="Sentence ${mention.sentence}, Type: ${mention.type}">
                    ${mention.mention}
                </span>
            `;
        });
        
        resultHTML += `
                </div>
            </div>
        `;
    });
    
    if (Object.keys(chains).length === 0) {
        resultHTML += '<p style="color: var(--color-text-secondary); font-style: italic;">No coreference chains found. Try using pronouns like "he", "she", "it" referring to named entities.</p>';
    }
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runCoherenceAnalysis() {
    const input = document.getElementById('discourse-input').value;
    const output = document.getElementById('discourse-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(1100);
    
    const coherence = MockNLPProcessor.coherenceAnalysis(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 16px; color: var(--color-text);">Coherence Analysis Results:</h4>';
    
    resultHTML += `
        <div class="coherence-score">
            <div class="coherence-header">
                Overall Coherence Score: <strong style="color: var(--color-primary);">${coherence.average}</strong>
            </div>
    `;
    
    coherence.scores.forEach(score => {
        resultHTML += `
            <div class="coherence-item">
                <div class="coherence-sentences">
                    S${score.sentence1} → S${score.sentence2}
                </div>
                <div class="coherence-value">${score.score}</div>
            </div>
        `;
    });
    
    resultHTML += '</div>';
    
    // Add sentence breakdown
    resultHTML += `
        <div class="coherence-score" style="margin-top: 16px;">
            <div class="coherence-header">Sentence Breakdown:</div>
    `;
    
    coherence.sentences.forEach((sentence, index) => {
        resultHTML += `
            <div class="coherence-item">
                <div class="coherence-sentences">S${index + 1}: "${sentence}"</div>
            </div>
        `;
    });
    
    resultHTML += '</div></div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

async function runDiscourseSegmentation() {
    const input = document.getElementById('discourse-input').value;
    const output = document.getElementById('discourse-output');
    const app = window.nlpApp;
    
    if (!input.trim()) return;
    
    app.showLoading(output);
    await app.simulateProcessing(1000);
    
    const segments = MockNLPProcessor.discourseSegmentation(input);
    
    let resultHTML = '<div class="demo-results">';
    resultHTML += '<h4 style="margin-bottom: 16px; color: var(--color-text);">Discourse Segmentation Results:</h4>';
    
    segments.forEach((segment, index) => {
        resultHTML += `
            <div class="discourse-segment">
                <div class="segment-header">
                    <div class="segment-label">Segment ${index + 1}</div>
                    <div class="segment-topic">${segment.topic}</div>
                </div>
                <div class="segment-content">
                    ${segment.sentences.join('. ')}${segment.sentences.length > 0 ? '.' : ''}
                </div>
            </div>
        `;
    });
    
    if (segments.length === 0) {
        resultHTML += '<p style="color: var(--color-text-secondary); font-style: italic;">No discourse segments identified. Try using transition words like "however", "furthermore", or "meanwhile".</p>';
    }
    
    resultHTML += '</div>';
    
    app.hideLoading(output);
    output.innerHTML = resultHTML;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    window.nlpApp = new NLPApp();
    
    // Set up global functions for demo buttons
    window.runStemming = runStemming;
    window.runLemmatization = runLemmatization;
    window.runTokenization = runTokenization;
    window.runPOSTagging = runPOSTagging;
    window.runDependencyParsing = runDependencyParsing;
    window.runParseTree = runParseTree;
    window.runNER = runNER;
    window.runWSD = runWSD;
    window.runIntentRecognition = runIntentRecognition;
    window.runContextAnalysis = runContextAnalysis;
    window.runCoreferenceResolution = runCoreferenceResolution;
    window.runCoherenceAnalysis = runCoherenceAnalysis;
    window.runDiscourseSegmentation = runDiscourseSegmentation;
});