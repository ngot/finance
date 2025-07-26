// 多语言翻译数据
const translations = {
    zh: {
        'page-title': '债务循环投资计算器',
        'main-title': '🏠 债务循环投资计算器',
        'main-subtitle': '比较 Offset 账户 vs 债务循环投资策略的收益差异',
        'available-funds': '可用资金',
        'mortgage-rate': '房贷利率',
        'tax-rate': '边际税率',
        'investment-return': '预期投资年回报率',
        'time-horizon': '投资时间',
        'years': '年',
        'calculate-btn': '🧮 计算收益对比',
        'results-title': '📊 收益对比分析',
        'offset-strategy': '💰 Offset 账户策略',
        'debt-cycle-strategy': '📈 债务循环投资策略',
        'annual-return': '年税后收益',
        'strategy': '策略',
        'annual-income': '年收益',
        'risk-level': '风险等级',
        'advantages': '优势',
        'offset-account': 'Offset 账户',
        'debt-cycle-investment': '债务循环投资',
        'no-risk': '🟢 无风险',
        'medium-risk': '🟡 中等风险',
        'stable-certain': '稳定、确定',
        'tax-optimization': '税务优化、长期增长',
        'breakeven-title': '🎯 债务循环盈亏平衡点',
        'breakeven-text1': '投资回报率需要达到',
        'breakeven-text2': '才能超越 Offset 账户收益',
        'placeholder-text': '请填写左侧参数并点击计算按钮查看结果',
        'available-funds-tooltip': '您准备用于投资或放入offset的资金总额',
        'mortgage-rate-tooltip': '当前房贷年利率',
        'tax-rate-tooltip': '包含Medicare Levy的边际税率',
        'investment-return-tooltip': 'ETF等投资产品的预期年化回报率',
        'time-horizon-tooltip': '计算收益的时间周期'
    },
    en: {
        'page-title': 'Debt Recycling Investment Calculator',
        'main-title': '🏠 Debt Recycling Investment Calculator',
        'main-subtitle': 'Compare Offset Account vs Debt Recycling Investment Strategy Returns',
        'available-funds': 'Available Funds',
        'mortgage-rate': 'Mortgage Rate',
        'tax-rate': 'Marginal Tax Rate',
        'investment-return': 'Expected Annual Investment Return',
        'time-horizon': 'Investment Period',
        'years': 'years',
        'calculate-btn': '🧮 Calculate Returns Comparison',
        'results-title': '📊 Returns Comparison Analysis',
        'offset-strategy': '💰 Offset Account Strategy',
        'debt-cycle-strategy': '📈 Debt Recycling Investment Strategy',
        'annual-return': 'Annual After-Tax Return',
        'strategy': 'Strategy',
        'annual-income': 'Annual Return',
        'risk-level': 'Risk Level',
        'advantages': 'Advantages',
        'offset-account': 'Offset Account',
        'debt-cycle-investment': 'Debt Recycling Investment',
        'no-risk': '🟢 No Risk',
        'medium-risk': '🟡 Medium Risk',
        'stable-certain': 'Stable & Certain',
        'tax-optimization': 'Tax Optimization & Long-term Growth',
        'breakeven-title': '🎯 Debt Recycling Break-even Point',
        'breakeven-text1': 'Investment return rate needs to reach',
        'breakeven-text2': 'to outperform Offset Account returns',
        'placeholder-text': 'Please fill in the parameters on the left and click calculate to view results',
        'available-funds-tooltip': 'Total funds you plan to invest or put into offset account',
        'mortgage-rate-tooltip': 'Current annual mortgage interest rate',
        'tax-rate-tooltip': 'Marginal tax rate including Medicare Levy',
        'investment-return-tooltip': 'Expected annual return rate for ETF and other investment products',
        'time-horizon-tooltip': 'Time period for calculating returns'
    }
};

// 当前语言
let currentLanguage = 'en';

// 初始化多语言功能
function initializeI18n() {
    const languageSelector = document.getElementById('languageSelector');
    languageSelector.addEventListener('change', function(e) {
        currentLanguage = e.target.value;
        updateLanguage();
        document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    });
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

    // 更新工具提示
    const tooltips = document.querySelectorAll('[data-tooltip-key]');
    tooltips.forEach(tooltip => {
        const key = tooltip.getAttribute('data-tooltip-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            tooltip.setAttribute('data-tooltip', translations[currentLanguage][key]);
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeI18n();
    // 立即应用默认英文翻译
    updateLanguage();
});

document.getElementById('calculatorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateReturns();
});

function calculateReturns() {
    // 获取输入值
    const availableFunds = parseFloat(document.getElementById('availableFunds').value);
    const mortgageRate = parseFloat(document.getElementById('mortgageRate').value) / 100;
    const taxRate = parseFloat(document.getElementById('taxRate').value) / 100;
    const investmentReturn = parseFloat(document.getElementById('investmentReturn').value) / 100;
    const timeHorizon = parseFloat(document.getElementById('timeHorizon').value);

    // 验证输入
    if (isNaN(availableFunds) || isNaN(mortgageRate) || isNaN(taxRate) || isNaN(investmentReturn) || isNaN(timeHorizon)) {
        const errorMessage = currentLanguage === 'zh' ? 
            '请确保所有字段都填写了有效数字' : 
            'Please ensure all fields are filled with valid numbers';
        alert(errorMessage);
        return;
    }

    // 计算 Offset 账户收益
    const offsetAnnualSavings = availableFunds * mortgageRate;
    const offsetTotalReturn = offsetAnnualSavings * timeHorizon;

    // 计算债务循环投资收益
    const investmentGross = availableFunds * investmentReturn;
    const loanInterest = availableFunds * mortgageRate;
    const taxDeduction = loanInterest * taxRate;
    const netInterestCost = loanInterest - taxDeduction;
    const debtCycleAnnualReturn = investmentGross - netInterestCost;
    const debtCycleTotalReturn = debtCycleAnnualReturn * timeHorizon;

    // 计算盈亏平衡点
    const breakevenReturn = mortgageRate / (1 - taxRate);

    // 更新显示
    document.getElementById('offsetReturn').textContent = formatCurrency(offsetTotalReturn);
    document.getElementById('debtCycleReturn').textContent = formatCurrency(debtCycleTotalReturn);
    document.getElementById('offsetTableReturn').textContent = formatCurrency(offsetTotalReturn);
    document.getElementById('debtCycleTableReturn').textContent = formatCurrency(debtCycleTotalReturn);
    document.getElementById('breakevenRate').textContent = (breakevenReturn * 100).toFixed(2) + '%';

    // 显示结果，隐藏占位符
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('placeholder').classList.add('hidden');

    // 根据哪个策略更好来调整卡片样式
    const offsetCard = document.querySelector('.result-card.offset');
    const debtCycleCard = document.querySelector('.result-card.debt-cycle');
    
    if (debtCycleTotalReturn > offsetTotalReturn) {
        debtCycleCard.style.transform = 'scale(1.05)';
        debtCycleCard.style.boxShadow = '0 10px 30px rgba(67, 233, 123, 0.3)';
        offsetCard.style.transform = 'scale(1)';
        offsetCard.style.boxShadow = 'none';
    } else {
        offsetCard.style.transform = 'scale(1.05)';
        offsetCard.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.3)';
        debtCycleCard.style.transform = 'scale(1)';
        debtCycleCard.style.boxShadow = 'none';
    }
}

function formatCurrency(amount) {
    const locale = currentLanguage === 'zh' ? 'zh-CN' : 'en-AU';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// 实时计算功能
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (document.getElementById('results').classList.contains('hidden')) {
            return;
        }
        calculateReturns();
    });
});