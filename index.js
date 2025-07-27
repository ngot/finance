// 多语言翻译数据
const translations = {
    zh: {
        'page-title': '⚒️澳洲金融工具箱 - Finance Tools',
        'main-title': '🏦 金融工具箱',
        'main-subtitle': '专业的澳洲投资理财计算工具集合，帮助您做出明智的财务决策',
        'tools-title': '🛠️ 可用工具',
        'tools-subtitle': '我们提供一系列专业的金融计算工具，基于澳洲税务和投资环境设计，帮助您分析不同的投资策略和财务规划方案。',
        'debt-cycle-title': '债务循环投资计算器',
        'debt-cycle-description': '比较 Offset 账户与债务循环投资策略的收益差异，帮助您优化房贷和投资组合。',
        'debt-cycle-feature1': '实时收益对比分析',
        'debt-cycle-feature2': '税务优化计算',
        'debt-cycle-feature3': '盈亏平衡点分析',
        'debt-cycle-feature4': '多时间周期支持',
        'coming-soon': '即将推出',
        'investment-calculator-title': '投资组合计算器',
        'investment-calculator-description': '分析不同资产配置的风险收益特征，优化您的投资组合分配策略。',
        'investment-calculator-feature1': '资产配置优化',
        'investment-calculator-feature2': '风险收益分析',
        'investment-calculator-feature3': '历史回测功能',
        'investment-calculator-feature4': '多币种支持',
        'property-calculator-title': '房产投资计算器',
        'property-calculator-description': '评估房产投资的现金流、资本增值和税务影响，全面分析投资回报。',
        'property-calculator-feature1': '现金流分析',
        'property-calculator-feature2': '税务抵扣计算',
        'property-calculator-feature3': '资本增值预测',
        'property-calculator-feature4': '租金收益率分析',
        'retirement-calculator-title': '退休规划计算器',
        'retirement-calculator-description': '基于澳洲超级年金制度，计算退休所需资金和最优储蓄策略。',
        'retirement-calculator-feature1': '超级年金优化',
        'retirement-calculator-feature2': '退休资金需求',
        'retirement-calculator-feature3': '税务策略规划',
        'retirement-calculator-feature4': '通胀影响分析',
        'tax-calculator-title': '税务优化计算器',
        'tax-calculator-description': '分析不同收入结构和投资策略的税务影响，最大化税后收益。',
        'tax-calculator-feature1': '个人所得税计算',
        'tax-calculator-feature2': '资本利得税优化',
        'tax-calculator-feature3': '负扣税策略',
        'tax-calculator-feature4': '家庭信托分析',
        'loan-calculator-title': '贷款比较计算器',
        'loan-calculator-description': '比较不同贷款产品的成本和特性，找到最适合的融资方案。',
        'loan-calculator-feature1': '多产品对比',
        'loan-calculator-feature2': '还款计划分析',
        'loan-calculator-feature3': '提前还款影响',
        'loan-calculator-feature4': '利率变化模拟',
        'footer-disclaimer': '⚠️ 本网站提供的工具仅供教育和参考用途，不构成财务建议。',
        'footer-advice': '在做出任何投资决策前，请咨询专业的财务顾问。',
        'footer-copyright': '© 2025 Finance Tools. 专为澳洲投资者设计。'
    },
    en: {
        'page-title': '⚒️Australian Finance Tools',
        'main-title': '🏦 Finance Tools',
        'main-subtitle': 'Professional Australian investment and financial planning calculator suite to help you make informed financial decisions',
        'tools-title': '🛠️ Available Tools',
        'tools-subtitle': 'We provide a series of professional financial calculation tools designed based on Australian tax and investment environment to help you analyze different investment strategies and financial planning solutions.',
        'debt-cycle-title': 'Debt Recycling Investment Calculator',
        'debt-cycle-description': 'Compare returns between Offset Account and Debt Recycling Investment strategies to optimize your mortgage and investment portfolio.',
        'debt-cycle-feature1': 'Real-time return comparison analysis',
        'debt-cycle-feature2': 'Tax optimization calculations',
        'debt-cycle-feature3': 'Break-even point analysis',
        'debt-cycle-feature4': 'Multi-timeframe support',
        'coming-soon': 'Coming Soon',
        'investment-calculator-title': 'Investment Portfolio Calculator',
        'investment-calculator-description': 'Analyze risk-return characteristics of different asset allocations and optimize your investment portfolio allocation strategy.',
        'investment-calculator-feature1': 'Asset allocation optimization',
        'investment-calculator-feature2': 'Risk-return analysis',
        'investment-calculator-feature3': 'Historical backtesting',
        'investment-calculator-feature4': 'Multi-currency support',
        'property-calculator-title': 'Property Investment Calculator',
        'property-calculator-description': 'Evaluate cash flow, capital growth and tax implications of property investments for comprehensive return analysis.',
        'property-calculator-feature1': 'Cash flow analysis',
        'property-calculator-feature2': 'Tax deduction calculations',
        'property-calculator-feature3': 'Capital growth projections',
        'property-calculator-feature4': 'Rental yield analysis',
        'retirement-calculator-title': 'Retirement Planning Calculator',
        'retirement-calculator-description': 'Calculate retirement funding requirements and optimal savings strategies based on Australian superannuation system.',
        'retirement-calculator-feature1': 'Superannuation optimization',
        'retirement-calculator-feature2': 'Retirement funding needs',
        'retirement-calculator-feature3': 'Tax strategy planning',
        'retirement-calculator-feature4': 'Inflation impact analysis',
        'tax-calculator-title': 'Tax Optimization Calculator',
        'tax-calculator-description': 'Analyze tax implications of different income structures and investment strategies to maximize after-tax returns.',
        'tax-calculator-feature1': 'Personal income tax calculation',
        'tax-calculator-feature2': 'Capital gains tax optimization',
        'tax-calculator-feature3': 'Negative gearing strategies',
        'tax-calculator-feature4': 'Family trust analysis',
        'loan-calculator-title': 'Loan Comparison Calculator',
        'loan-calculator-description': 'Compare costs and features of different loan products to find the most suitable financing solution.',
        'loan-calculator-feature1': 'Multi-product comparison',
        'loan-calculator-feature2': 'Repayment schedule analysis',
        'loan-calculator-feature3': 'Early repayment impact',
        'loan-calculator-feature4': 'Interest rate change simulation',
        'footer-disclaimer': '⚠️ The tools provided on this website are for educational and reference purposes only and do not constitute financial advice.',
        'footer-advice': 'Please consult a professional financial advisor before making any investment decisions.',
        'footer-copyright': '© 2025 Finance Tools. Designed for Australian investors.'
    }
};

// 当前语言
let currentLanguage = 'en';

// 初始化多语言功能
function initializeI18n() {
    const langEn = document.getElementById('langEn');
    const langZh = document.getElementById('langZh');
    
    langEn.addEventListener('click', function() {
        currentLanguage = 'en';
        updateLanguage();
        updateActiveButton();
        document.documentElement.lang = 'en';
    });
    
    langZh.addEventListener('click', function() {
        currentLanguage = 'zh';
        updateLanguage();
        updateActiveButton();
        document.documentElement.lang = 'zh-CN';
    });
}

// 更新活动按钮状态
function updateActiveButton() {
    const langEn = document.getElementById('langEn');
    const langZh = document.getElementById('langZh');
    
    if (currentLanguage === 'en') {
        langEn.classList.add('active');
        langZh.classList.remove('active');
    } else {
        langZh.classList.add('active');
        langEn.classList.remove('active');
    }
}

// 更新页面语言
function updateLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // 更新页面标题
    document.title = translations[currentLanguage]['page-title'];
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeI18n();
    // 立即应用默认英文翻译
    updateLanguage();
});