/* ========================================
   EXAMPRO WEBSITE - UNIFIED JAVASCRIPT
   ======================================== */

/* ========================================
   1. GLOBAL VARIABLES & CONFIGURATION
   ======================================== */

// Practice test configuration and state
let currentQuestion = 0; // Current question index (0-based)
let answers = {}; // Object to store user answers {questionIndex: selectedOption}
let flaggedQuestions = new Set(); // Set to store flagged question indices
let testCompleted = false; // Boolean to track if test is completed
let currentExam = null; // Currently selected exam for calendar

// CSC Exam Questions Database
// This contains all the practice test questions with their options and correct answers
const questions = [
	{
		id: 1,
		category: 'Government Structure',
		question:
			'Which government agency is responsible for conducting the Civil Service Examination in the Philippines?',
		options: [
			{label: 'A', text: 'Department of Education (DepEd)'},
			{label: 'B', text: 'Civil Service Commission (CSC)'},
			{label: 'C', text: 'Commission on Higher Education (CHED)'},
			{label: 'D', text: 'Professional Regulation Commission (PRC)'},
		],
		correctAnswer: 'B', // CSC is the correct answer
	},
	{
		id: 2,
		category: 'Philippine Constitution',
		question: 'What is the supreme law of the Philippines?',
		options: [
			{label: 'A', text: 'Civil Code'},
			{label: 'B', text: 'Revised Penal Code'},
			{label: 'C', text: '1987 Philippine Constitution'},
			{label: 'D', text: 'Administrative Code'},
		],
		correctAnswer: 'C', // 1987 Constitution is the supreme law
	},
	{
		id: 3,
		category: 'Mathematics',
		question: 'If 3x + 5 = 20, what is the value of x?',
		options: [
			{label: 'A', text: '3'},
			{label: 'B', text: '5'},
			{label: 'C', text: '7'},
			{label: 'D', text: '15'},
		],
		correctAnswer: 'B', // 3x = 15, so x = 5
	},
	{
		id: 4,
		category: 'English Proficiency',
		question: 'Choose the correct sentence:',
		options: [
			{label: 'A', text: 'The team are playing well today.'},
			{label: 'B', text: 'The team is playing well today.'},
			{label: 'C', text: 'The team were playing well today.'},
			{label: 'D', text: 'The team have playing well today.'},
		],
		correctAnswer: 'B', // "Team" is singular, so "is" is correct
	},
	{
		id: 5,
		category: 'Filipino',
		question: "Ano ang tamang kahulugan ng salitang 'pagkakaisa'?",
		options: [
			{label: 'A', text: 'Pagkakawatak-watak'},
			{label: 'B', text: 'Pagkakabuklod o unity'},
			{label: 'C', text: 'Pagkakalito'},
			{label: 'D', text: 'Pagkakaiba'},
		],
		correctAnswer: 'B', // Pagkakaisa means unity
	},
];

// Exam calendar data for 2025
// Contains information about upcoming Civil Service Examinations
const examData = {
	july: {
		title: 'Civil Service Computerized Examination (CSC-COMEX)',
		date: 'Tuesday | Thursday, July 1, 3, 8, 10, 2025',
		deadline: 'Registration Status: On-going',
		countdown: 'Until slots are filled',
		locations: ['CSC Regional Office VIII'],
		description: '3rd QUARTER 2025 SCHEDULE',
	},
	august: {
		title: 'Civil Service Exam (Paper and Pencil Test)',
		date: 'Sunday, August 24, 2025',
		deadline: 'Application Deadline: Thursday, July 24, 2025',
		countdown: '32 days remaining to apply',
		locations: ['Nationwide (CSC Regional Offices)'],
		description:
			'Second nationwide schedule for the Civil Service Examination for 2025. Both Professional and Sub-Professional level examinations will be conducted. Application must be completed one month before the examination date.',
	},
};

/* ========================================
   2. UTILITY FUNCTIONS
   ======================================== */

/**
 * Safely get element by ID with error handling
 * @param {string} id - Element ID to find
 * @returns {Element|null} - Found element or null
 */
function getElementById(id) {
	const element = document.getElementById(id);
	if (!element) {
		console.warn(`Element with ID '${id}' not found`);
	}
	return element;
}

/**
 * Safely query selector with error handling
 * @param {string} selector - CSS selector
 * @returns {Element|null} - Found element or null
 */
function querySelector(selector) {
	const element = document.querySelector(selector);
	if (!element) {
		console.warn(`Element with selector '${selector}' not found`);
	}
	return element;
}

/**
 * Add event listener with error handling
 * @param {Element} element - Element to add listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler function
 */
function addEventListenerSafe(element, event, handler) {
	if (element && typeof handler === 'function') {
		element.addEventListener(event, handler);
	} else {
		console.warn('Invalid element or handler for event listener');
	}
}

/**
 * Smooth scroll to element
 * @param {Element} element - Element to scroll to
 * @param {string} block - Scroll position ('start', 'center', 'end')
 */
function smoothScrollTo(element, block = 'start') {
	if (element) {
		element.scrollIntoView({
			behavior: 'smooth',
			block: block,
		});
	}
}

/* ========================================
   3. HOMEPAGE FUNCTIONALITY
   ======================================== */

/**
 * Initialize homepage functionality
 * Sets up FAQ toggles and smooth scrolling
 */
function initializeHomepage() {
	console.log('Initializing homepage...');

	// Initialize FAQ functionality
	initializeFAQ();

	// Initialize smooth scrolling for navigation links
	initializeSmoothScrolling();

	// Initialize donation button tracking
	initializeDonationTracking();
}

/**
 * Initialize FAQ accordion functionality
 * Allows users to expand/collapse FAQ items
 */
function initializeFAQ() {
	// Get all FAQ question buttons
	const faqQuestions = document.querySelectorAll('.faq-question');

	faqQuestions.forEach((question) => {
		addEventListenerSafe(question, 'click', function () {
			// Get the parent FAQ item
			const faqItem = this.closest('.faq-item');

			if (faqItem) {
				// Toggle the active class
				faqItem.classList.toggle('active');

				// Close other FAQ items (optional - for accordion behavior)
				faqQuestions.forEach((otherQuestion) => {
					const otherItem = otherQuestion.closest('.faq-item');
					if (otherItem && otherItem !== faqItem) {
						otherItem.classList.remove('active');
					}
				});
			}
		});
	});

	console.log(`Initialized ${faqQuestions.length} FAQ items`);
}

/**
 * Initialize smooth scrolling for anchor links
 * Provides smooth navigation between page sections
 */
function initializeSmoothScrolling() {
	// Get all navigation links that start with #
	const navLinks = document.querySelectorAll('a[href^="#"]');

	navLinks.forEach((link) => {
		addEventListenerSafe(link, 'click', function (e) {
			const href = this.getAttribute('href');

			// Skip if it's just "#" or empty
			if (href === '#' || href === '') return;

			// Find target element
			const targetId = href.substring(1);
			const targetElement = getElementById(targetId);

			if (targetElement) {
				e.preventDefault();
				smoothScrollTo(targetElement, 'start');
			}
		});
	});

	console.log(
		`Initialized smooth scrolling for ${navLinks.length} navigation links`
	);
}

/**
 * Initialize donation button tracking
 * Tracks clicks on donation buttons for analytics
 */
function initializeDonationTracking() {
	const donationButtons = document.querySelectorAll('.donation-btn');

	donationButtons.forEach((button) => {
		addEventListenerSafe(button, 'click', function () {
			const buttonText = this.textContent.trim();
			console.log(`Donation button clicked: ${buttonText}`);

			// Here you could add analytics tracking
			// Example: gtag('event', 'donation_click', { button_text: buttonText });
		});
	});
}

/* ========================================
   4. PRACTICE TEST FUNCTIONALITY
   ======================================== */

/**
 * Initialize the practice test
 * Sets up the test interface and displays the first question
 */
function initializePracticeTest() {
	console.log('Initializing practice test...');

	// Reset test state
	currentQuestion = 0;
	answers = {};
	flaggedQuestions.clear();
	testCompleted = false;

	// Generate the question number grid
	generateQuestionGrid();

	// Display the first question
	displayQuestion();

	// Update progress indicators
	updateProgress();

	// Update navigation buttons
	updateNavigation();

	// Set up event listeners
	setupPracticeTestEventListeners();

	console.log(`Practice test initialized with ${questions.length} questions`);
}

/**
 * Generate the question number grid in the sidebar
 * Creates clickable numbers for each question
 */
function generateQuestionGrid() {
	const grid = getElementById('question-grid');
	if (!grid) return;

	// Clear existing grid
	grid.innerHTML = '';

	// Create a number button for each question
	questions.forEach((_, index) => {
		const questionNum = document.createElement('div');
		questionNum.className = 'question-number unanswered';
		questionNum.textContent = index + 1;
		questionNum.onclick = () => goToQuestion(index);
		grid.appendChild(questionNum);
	});

	console.log(`Generated question grid with ${questions.length} questions`);
}

/**
 * Display the current question and its options
 * Updates all question-related UI elements
 */
function displayQuestion() {
	const question = questions[currentQuestion];
	if (!question) return;

	console.log(
		`Displaying question ${currentQuestion + 1}: ${question.category}`
	);

	// Update question info
	const questionBadge = getElementById('question-badge');
	const questionCategory = getElementById('question-category');
	const questionText = getElementById('question-text');

	if (questionBadge) {
		questionBadge.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
	}

	if (questionCategory) {
		questionCategory.textContent = question.category;
	}

	if (questionText) {
		questionText.textContent = question.question;
	}

	// Update flag button state
	updateFlagButton();

	// Generate and display options
	generateOptions(question);

	// Update question states in the grid
	updateQuestionStates();
}

/**
 * Update the flag button based on current question's flag status
 */
function updateFlagButton() {
	const flagBtn = getElementById('flag-btn');
	const flagText = getElementById('flag-text');

	if (flagBtn && flagText) {
		if (flaggedQuestions.has(currentQuestion)) {
			flagBtn.classList.add('flagged');
			flagText.textContent = 'Flagged for review';
		} else {
			flagBtn.classList.remove('flagged');
			flagText.textContent = 'Flag for review';
		}
	}
}

/**
 * Generate and display answer options for the current question
 * @param {Object} question - Question object containing options
 */
function generateOptions(question) {
	const optionsContainer = getElementById('options');
	if (!optionsContainer) return;

	// Clear existing options
	optionsContainer.innerHTML = '';

	// Create option elements
	question.options.forEach((option) => {
		const optionDiv = document.createElement('div');
		optionDiv.className = 'option';

		// Check if this option is selected
		if (answers[currentQuestion] === option.label) {
			optionDiv.classList.add('selected');
		}

		// Create option HTML structure
		optionDiv.innerHTML = `
            <div class="option-radio"></div>
            <span class="option-label">${option.label}.</span>
            <span class="option-text">${option.text}</span>
        `;

		// Add click handler to select this option
		optionDiv.onclick = () => selectOption(option.label);
		optionsContainer.appendChild(optionDiv);
	});
}

/**
 * Select an answer option for the current question
 * @param {string} label - The selected option label (A, B, C, D)
 */
function selectOption(label) {
	console.log(`Selected option ${label} for question ${currentQuestion + 1}`);

	// Store the answer
	answers[currentQuestion] = label;

	// Refresh the display to show selection
	displayQuestion();

	// Update progress indicators
	updateProgress();

	// Update navigation buttons
	updateNavigation();
}

/**
 * Navigate to a specific question by index
 * @param {number} index - Question index to navigate to
 */
function goToQuestion(index) {
	if (index >= 0 && index < questions.length) {
		console.log(`Navigating to question ${index + 1}`);
		currentQuestion = index;
		displayQuestion();
		updateNavigation();
	}
}

/**
 * Update the visual states of question numbers in the grid
 * Shows which questions are answered, current, flagged, etc.
 */
function updateQuestionStates() {
	const questionNumbers = document.querySelectorAll('.question-number');

	questionNumbers.forEach((num, index) => {
		// Reset all classes
		num.className = 'question-number';

		// Apply appropriate state class
		if (index === currentQuestion) {
			num.classList.add('current');
		} else if (answers[index]) {
			num.classList.add('answered');
		} else {
			num.classList.add('unanswered');
		}

		// Add flagged class if question is flagged
		if (flaggedQuestions.has(index)) {
			num.classList.add('flagged');
		}
	});
}

/**
 * Update progress bar and completion counters
 * Shows how many questions have been answered
 */
function updateProgress() {
	const answeredCount = Object.keys(answers).length;
	const totalQuestions = questions.length;
	const progressPercentage = (answeredCount / totalQuestions) * 100;

	// Update progress text
	const answeredCountEl = getElementById('answered-count');
	const totalQuestionsEl = getElementById('total-questions');
	const completionCountEl = getElementById('completion-count');
	const completionTotalEl = getElementById('completion-total');

	if (answeredCountEl) answeredCountEl.textContent = answeredCount;
	if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions;
	if (completionCountEl) completionCountEl.textContent = answeredCount;
	if (completionTotalEl) completionTotalEl.textContent = totalQuestions;

	// Update progress bar
	const progressFill = getElementById('progress-fill');
	if (progressFill) {
		progressFill.style.width = `${progressPercentage}%`;
	}

	// Update complete button state
	const completeBtn = getElementById('complete-btn');
	if (completeBtn) {
		if (answeredCount === totalQuestions) {
			completeBtn.disabled = false;
			completeBtn.textContent = `Complete Test (${answeredCount}/${totalQuestions})`;
		} else {
			completeBtn.disabled = true;
			completeBtn.textContent = `Answer all questions (${answeredCount}/${totalQuestions})`;
		}
	}

	console.log(
		`Progress updated: ${answeredCount}/${totalQuestions} questions answered`
	);
}

/**
 * Update navigation button states
 * Enables/disables previous/next buttons and changes text
 */
function updateNavigation() {
	const prevBtn = getElementById('prev-btn');
	const nextBtn = getElementById('next-btn');

	if (prevBtn) {
		prevBtn.disabled = currentQuestion === 0;
	}

	if (nextBtn) {
		if (currentQuestion === questions.length - 1) {
			nextBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
		} else {
			nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
		}
	}
}

/**
 * Navigate to the previous question
 */
function previousQuestion() {
	if (currentQuestion > 0) {
		currentQuestion--;
		displayQuestion();
		updateNavigation();
		console.log(`Moved to previous question: ${currentQuestion + 1}`);
	}
}

/**
 * Navigate to the next question or finish test
 */
function nextQuestion() {
	if (currentQuestion < questions.length - 1) {
		currentQuestion++;
		displayQuestion();
		updateNavigation();
		console.log(`Moved to next question: ${currentQuestion + 1}`);
	} else {
		// Last question - attempt to complete test
		if (Object.keys(answers).length === questions.length) {
			completeTest();
		} else {
			alert('Please answer all questions before completing the test.');
		}
	}
}

/**
 * Toggle flag status for the current question
 */
function toggleFlag() {
	if (flaggedQuestions.has(currentQuestion)) {
		flaggedQuestions.delete(currentQuestion);
		console.log(`Unflagged question ${currentQuestion + 1}`);
	} else {
		flaggedQuestions.add(currentQuestion);
		console.log(`Flagged question ${currentQuestion + 1} for review`);
	}

	// Refresh display to show flag status
	displayQuestion();
}

/**
 * Complete the practice test and show results
 */
function completeTest() {
	if (Object.keys(answers).length !== questions.length) {
		alert('Please answer all questions before completing the test.');
		return;
	}

	console.log('Completing practice test...');

	// Calculate score by comparing answers with correct answers
	let correctAnswers = 0;
	questions.forEach((question, index) => {
		if (answers[index] === question.correctAnswer) {
			correctAnswers++;
		}
	});

	console.log(`Test completed. Score: ${correctAnswers}/${questions.length}`);

	// Update results modal with score
	const finalScoreEl = getElementById('final-score');
	const correctAnswersEl = getElementById('correct-answers');
	const totalAnswersEl = getElementById('total-answers');

	if (finalScoreEl)
		finalScoreEl.textContent = `${correctAnswers}/${questions.length}`;
	if (correctAnswersEl) correctAnswersEl.textContent = correctAnswers;
	if (totalAnswersEl) totalAnswersEl.textContent = questions.length;

	// Show results modal
	const resultsModal = getElementById('results-modal');
	if (resultsModal) {
		resultsModal.classList.add('show');
	}

	testCompleted = true;
}

/**
 * Review answers (placeholder for future implementation)
 */
function reviewAnswers() {
	const resultsModal = getElementById('results-modal');
	if (resultsModal) {
		resultsModal.classList.remove('show');
	}

	// Future: Implement review mode showing correct/incorrect answers
	alert('Review mode would show correct answers and explanations.');
	console.log('Review answers functionality called');
}

/**
 * Restart the practice test
 */
function restartTest() {
	console.log('Restarting practice test...');

	// Reset all test state
	currentQuestion = 0;
	answers = {};
	flaggedQuestions.clear();
	testCompleted = false;

	// Hide results modal
	const resultsModal = getElementById('results-modal');
	if (resultsModal) {
		resultsModal.classList.remove('show');
	}

	// Reinitialize the test
	initializePracticeTest();
}

/**
 * Set up event listeners for practice test functionality
 */
function setupPracticeTestEventListeners() {
	// Navigation buttons
	const prevBtn = getElementById('prev-btn');
	const nextBtn = getElementById('next-btn');
	const flagBtn = getElementById('flag-btn');
	const completeBtn = getElementById('complete-btn');

	if (prevBtn) prevBtn.onclick = previousQuestion;
	if (nextBtn) nextBtn.onclick = nextQuestion;
	if (flagBtn) flagBtn.onclick = toggleFlag;
	if (completeBtn) completeBtn.onclick = completeTest;

	// Modal close functionality
	const resultsModal = getElementById('results-modal');
	if (resultsModal) {
		resultsModal.onclick = function (e) {
			if (e.target === this) {
				this.classList.remove('show');
			}
		};
	}

	console.log('Practice test event listeners set up');
}

/* ========================================
   5. EXAM CALENDAR FUNCTIONALITY
   ======================================== */

/**
 * Initialize exam calendar functionality
 */
function initializeExamCalendar() {
	console.log('Initializing exam calendar...');

	// Set up modal close functionality
	setupCalendarEventListeners();

	console.log('Exam calendar initialized');
}

/**
 * Show detailed information for a specific exam
 * @param {string} examKey - Key identifying the exam (july/august)
 */
function showExamDetails(examKey) {
	const exam = examData[examKey];
	if (!exam) {
		console.error(`Exam data not found for key: ${examKey}`);
		return;
	}

	console.log(`Showing details for ${examKey} exam`);
	currentExam = examKey;

	// Hide empty state and show details
	const emptyState = getElementById('empty-state');
	const examDetails = getElementById('exam-details');

	if (emptyState) emptyState.style.display = 'none';
	if (examDetails) examDetails.classList.add('show');

	// Update exam information
	const examTitle = getElementById('exam-title');
	const examDate = getElementById('exam-date');
	const deadlineText = getElementById('deadline-text');
	const countdownText = getElementById('countdown-text');
	const examDescription = getElementById('exam-description');

	if (examTitle) examTitle.textContent = exam.title;
	if (examDate) examDate.textContent = exam.date;
	if (deadlineText) deadlineText.textContent = exam.deadline;
	if (countdownText) countdownText.textContent = exam.countdown;
	if (examDescription) examDescription.textContent = exam.description;

	// Update testing locations
	updateTestingLocations(exam.locations);

	// Scroll to details section
	if (examDetails) {
		smoothScrollTo(examDetails, 'start');
	}
}

/**
 * Update the testing locations display
 * @param {Array} locations - Array of location names
 */
function updateTestingLocations(locations) {
	const locationTags = getElementById('location-tags');
	if (!locationTags) return;

	// Clear existing locations
	locationTags.innerHTML = '';

	// Add each location as a tag
	locations.forEach((location) => {
		const tag = document.createElement('span');
		tag.className = 'location-tag';
		tag.textContent = location;
		locationTags.appendChild(tag);
	});

	console.log(`Updated testing locations: ${locations.length} locations`);
}

/**
 * Show the reminder modal for a specific exam
 * @param {string} examKey - Key identifying the exam
 */
function showReminderModal(examKey) {
	console.log(`Showing reminder modal for ${examKey} exam`);
	currentExam = examKey;

	const reminderModal = getElementById('reminder-modal');
	if (reminderModal) {
		reminderModal.classList.add('show');
	}
}

/**
 * Set a reminder for the current exam
 * @param {Event} event - Form submit event
 */
function setReminder(event) {
	event.preventDefault();

	const email = event.target.querySelector('input[type="email"]').value;
	const examInfo = examData[currentExam];

	if (!email || !examInfo) {
		console.error('Missing email or exam information');
		return;
	}

	console.log(`Setting reminder for ${email} - ${examInfo.date}`);

	// Simulate setting reminder (in real app, this would call an API)
	alert(
		`Reminder set! We'll send notifications to ${email} about the ${examInfo.date} exam.`
	);

	// Close modal and reset form
	const reminderModal = getElementById('reminder-modal');
	if (reminderModal) {
		reminderModal.classList.remove('show');
	}

	event.target.reset();
}

/**
 * Set up event listeners for exam calendar functionality
 */
function setupCalendarEventListeners() {
	// Modal close functionality
	const reminderModal = getElementById('reminder-modal');
	if (reminderModal) {
		reminderModal.onclick = function (e) {
			if (e.target === this) {
				this.classList.remove('show');
			}
		};
	}

	console.log('Calendar event listeners set up');
}

/* ========================================
   6. GLOBAL EVENT HANDLERS
   ======================================== */

/**
 * Handle window resize events
 * Adjusts layout for responsive design
 */
function handleWindowResize() {
	// Add any responsive adjustments here
	console.log('Window resized');
}

/**
 * Handle scroll events
 * Can be used for scroll-based animations or navigation highlighting
 */
function handleScroll() {
	// Add scroll-based functionality here
	// Example: Update active navigation item based on scroll position
}

/**
 * Initialize global event listeners
 */
function initializeGlobalEventListeners() {
	// Window resize handler
	window.addEventListener('resize', handleWindowResize);

	// Scroll handler (throttled for performance)
	let scrollTimeout;
	window.addEventListener('scroll', function () {
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}
		scrollTimeout = setTimeout(handleScroll, 100);
	});

	console.log('Global event listeners initialized');
}

/* ========================================
   7. PAGE-SPECIFIC INITIALIZATION
   ======================================== */

/**
 * Detect current page and initialize appropriate functionality
 */
function initializeCurrentPage() {
	const currentPath = window.location.pathname;
	const currentPage = currentPath.split('/').pop() || 'index.html';

	console.log(`Initializing page: ${currentPage}`);

	// Initialize based on current page
	switch (currentPage) {
		case 'index.html':
		case '':
			initializeHomepage();
			break;

		case 'practice.html':
			initializePracticeTest();
			break;

		case 'calendar.html':
			initializeExamCalendar();
			break;

		default:
			console.log('Unknown page, initializing basic functionality');
			initializeHomepage(); // Fallback to homepage functionality
	}
}

/* ========================================
   8. MAIN INITIALIZATION
   ======================================== */

/**
 * Main initialization function
 * Called when the DOM is fully loaded
 */
function initializeWebsite() {
	console.log('=== ExamPro Website Initialization ===');
	console.log('Starting website initialization...');

	try {
		// Initialize global functionality
		initializeGlobalEventListeners();

		// Initialize page-specific functionality
		initializeCurrentPage();

		console.log('Website initialization completed successfully');
	} catch (error) {
		console.error('Error during website initialization:', error);
	}
}

/* ========================================
   9. GLOBAL FUNCTION EXPOSURE
   ======================================== */

// Make functions available globally for HTML onclick handlers
window.showExamDetails = showExamDetails;
window.showReminderModal = showReminderModal;
window.setReminder = setReminder;
window.reviewAnswers = reviewAnswers;
window.restartTest = restartTest;

/* ========================================
   10. DOM READY EVENT LISTENER
   ======================================== */

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Fallback initialization for older browsers
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
	// DOM is already loaded
	initializeWebsite();
}

/* ========================================
   11. ERROR HANDLING & DEBUGGING
   ======================================== */

/**
 * Global error handler for uncaught errors
 */
window.addEventListener('error', function (event) {
	console.error('Global error caught:', {
		message: event.message,
		filename: event.filename,
		lineno: event.lineno,
		colno: event.colno,
		error: event.error,
	});
});

/**
 * Global handler for unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function (event) {
	console.error('Unhandled promise rejection:', event.reason);
});

/* ========================================
   12. PERFORMANCE MONITORING
   ======================================== */

/**
 * Log performance metrics when page loads
 */
window.addEventListener('load', function () {
	// Use Performance API if available
	if (window.performance && window.performance.timing) {
		const timing = window.performance.timing;
		const loadTime = timing.loadEventEnd - timing.navigationStart;
		console.log(`Page load time: ${loadTime}ms`);
	}
});

/* ========================================
   13. DEVELOPER TOOLS PROTECTION
   ======================================== */

/**
 * Developer Tools Protection System
 * Note: This provides basic protection against casual users
 * Determined developers can still bypass these measures
 */

// Configuration for protection system
const PROTECTION_CONFIG = {
	enabled: true, // Set to false to disable protection
	redirectUrl: 'about:blank', // Where to redirect when tools detected
	warningMessage: 'Developer tools access is restricted on this website.',
	blockRightClick: true,
	blockKeyboardShortcuts: true,
	detectDevTools: true,
	showWarnings: true,
};

/**
 * Detect if developer tools are open
 * Uses various detection methods
 */
function detectDevTools() {
	if (!PROTECTION_CONFIG.enabled || !PROTECTION_CONFIG.detectDevTools) return;

	let devtools = {
		open: false,
		orientation: null,
	};

	// Method 1: Console detection
	let threshold = 160;
	setInterval(() => {
		if (
			window.outerHeight - window.innerHeight > threshold ||
			window.outerWidth - window.innerWidth > threshold
		) {
			if (!devtools.open) {
				devtools.open = true;
				handleDevToolsDetection();
			}
		} else {
			devtools.open = false;
		}
	}, 500);

	// Method 2: Console.log detection
	let element = document.createElement('div');
	Object.defineProperty(element, 'id', {
		get: function () {
			handleDevToolsDetection();
			return 'devtools-detected';
		},
	});

	setInterval(() => {
		console.log(element);
		console.clear();
	}, 1000);

	// Method 3: Debugger statement (commented out as it's too aggressive)
	// setInterval(() => {
	//     debugger;
	// }, 100);

	// Method 4: Performance timing detection
	setInterval(() => {
		let start = performance.now();
		debugger;
		let end = performance.now();
		if (end - start > 100) {
			handleDevToolsDetection();
		}
	}, 1000);
}

/**
 * Handle when developer tools are detected
 */
function handleDevToolsDetection() {
	if (!PROTECTION_CONFIG.enabled) return;

	console.log('Developer tools detected');

	if (PROTECTION_CONFIG.showWarnings) {
		alert(PROTECTION_CONFIG.warningMessage);
	}

	// Redirect or close page
	if (PROTECTION_CONFIG.redirectUrl) {
		window.location.href = PROTECTION_CONFIG.redirectUrl;
	}
}

/**
 * Disable right-click context menu
 */
function disableRightClick() {
	if (!PROTECTION_CONFIG.enabled || !PROTECTION_CONFIG.blockRightClick) return;

	document.addEventListener('contextmenu', function (e) {
		e.preventDefault();
		if (PROTECTION_CONFIG.showWarnings) {
			showProtectionWarning('Right-click is disabled on this website.');
		}
		return false;
	});

	// Disable drag and drop
	document.addEventListener('dragstart', function (e) {
		e.preventDefault();
		return false;
	});

	// Disable text selection (optional - can be annoying for users)
	// document.addEventListener('selectstart', function(e) {
	//     e.preventDefault();
	//     return false;
	// });
}

/**
 * Disable keyboard shortcuts for developer tools
 */
function disableKeyboardShortcuts() {
	if (!PROTECTION_CONFIG.enabled || !PROTECTION_CONFIG.blockKeyboardShortcuts)
		return;

	document.addEventListener('keydown', function (e) {
		// Disable F12
		if (e.keyCode === 123) {
			e.preventDefault();
			showProtectionWarning('Developer tools access is restricted.');
			return false;
		}

		// Disable Ctrl+Shift+I (Inspector)
		if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
			e.preventDefault();
			showProtectionWarning('Developer tools access is restricted.');
			return false;
		}

		// Disable Ctrl+Shift+J (Console)
		if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
			e.preventDefault();
			showProtectionWarning('Developer tools access is restricted.');
			return false;
		}

		// Disable Ctrl+U (View Source)
		if (e.ctrlKey && e.keyCode === 85) {
			e.preventDefault();
			showProtectionWarning('View source is restricted.');
			return false;
		}

		// Disable Ctrl+Shift+C (Element Inspector)
		if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
			e.preventDefault();
			showProtectionWarning('Element inspector is restricted.');
			return false;
		}

		// Disable Ctrl+Shift+K (Console in Firefox)
		if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
			e.preventDefault();
			showProtectionWarning('Developer tools access is restricted.');
			return false;
		}

		// Disable Ctrl+S (Save Page)
		if (e.ctrlKey && e.keyCode === 83) {
			e.preventDefault();
			showProtectionWarning('Saving page is restricted.');
			return false;
		}

		// Disable Ctrl+A (Select All) - optional
		// if (e.ctrlKey && e.keyCode === 65) {
		//     e.preventDefault();
		//     return false;
		// }

		// Disable Ctrl+P (Print) - optional
		// if (e.ctrlKey && e.keyCode === 80) {
		//     e.preventDefault();
		//     showProtectionWarning('Printing is restricted.');
		//     return false;
		// }
	});
}

/**
 * Show protection warning message
 * @param {string} message - Warning message to display
 */
function showProtectionWarning(message) {
	if (!PROTECTION_CONFIG.showWarnings) return;

	// Create a temporary warning element
	const warning = document.createElement('div');
	warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
	warning.textContent = message;

	// Add animation keyframes if not already added
	if (!document.querySelector('#protection-styles')) {
		const style = document.createElement('style');
		style.id = 'protection-styles';
		style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
		document.head.appendChild(style);
	}

	document.body.appendChild(warning);

	// Remove warning after 3 seconds
	setTimeout(() => {
		if (warning.parentNode) {
			warning.parentNode.removeChild(warning);
		}
	}, 3000);
}

/**
 * Disable common developer shortcuts and actions
 */
function disableCommonActions() {
	if (!PROTECTION_CONFIG.enabled) return;

	// Disable image dragging
	document.addEventListener('dragstart', function (e) {
		if (e.target.tagName === 'IMG') {
			e.preventDefault();
			return false;
		}
	});

	// Clear console periodically
	setInterval(() => {
		console.clear();
	}, 2000);

	// Override console methods (optional - can interfere with legitimate debugging)
	// console.log = console.warn = console.error = console.info = function() {};
}

/**
 * Initialize protection system
 */
function initializeProtection() {
	if (!PROTECTION_CONFIG.enabled) {
		console.log('Developer tools protection is disabled');
		return;
	}

	console.log('Initializing developer tools protection...');

	try {
		// Initialize all protection measures
		disableRightClick();
		disableKeyboardShortcuts();
		disableCommonActions();
		detectDevTools();

		console.log('Developer tools protection initialized');

		// Clear this log after initialization
		setTimeout(() => {
			console.clear();
		}, 1000);
	} catch (error) {
		console.error('Error initializing protection:', error);
	}
}

/**
 * Bypass protection (for legitimate development)
 * Call this function in console to temporarily disable protection
 */
window.bypassProtection = function (password) {
	const correctPassword = 'exampro2025'; // Change this to your preferred password

	if (password === correctPassword) {
		PROTECTION_CONFIG.enabled = false;
		console.log('Protection bypassed for this session');
		return true;
	} else {
		console.log('Invalid bypass password');
		return false;
	}
};

// Initialize protection when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeProtection);
} else {
	initializeProtection();
}

/* ========================================
   END OF JAVASCRIPT FILE
   ======================================== */

console.log('ExamPro JavaScript file loaded successfully');
