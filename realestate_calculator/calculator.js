// 房地产投资计算器主要逻辑

class PropertyInvestmentCalculator {
    constructor() {
        this.initializeEventListeners();
        this.cashFlowChart = null;
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.addEventListener('click', () => this.calculateInvestment());

        // 添加输入验证
        this.addInputValidation();
    }

    addInputValidation() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        input.classList.remove('error', 'success');
        
        if (input.value && (isNaN(value) || value < 0)) {
            input.classList.add('error');
            return false;
        } else if (input.value) {
            input.classList.add('success');
        }
        return true;
    }

    getInputValues() {
        return {
            // 房产信息
            purchasePrice: parseFloat(document.getElementById('purchasePrice').value) || 0,
            purchaseCosts: parseFloat(document.getElementById('purchaseCosts').value) || 0,
            weeklyRent: parseFloat(document.getElementById('weeklyRent').value) || 0,
            rentalGrowthRate: parseFloat(document.getElementById('rentalGrowthRate').value) || 0,
            propertyType: document.getElementById('propertyType').value,
            yearBuilt: parseInt(document.getElementById('yearBuilt').value) || new Date().getFullYear(),

            // 贷款信息
            loanAmount: parseFloat(document.getElementById('loanAmount').value) || 0,
            interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
            loanTerm: parseInt(document.getElementById('loanTerm').value) || 30,
            repaymentType: document.getElementById('repaymentType').value,

            // 运营费用
            strataFees: parseFloat(document.getElementById('strataFees').value) || 0,
            councilRates: parseFloat(document.getElementById('councilRates').value) || 0,
            waterRates: parseFloat(document.getElementById('waterRates').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
            managementFees: parseFloat(document.getElementById('managementFees').value) || 0,

            // 个人税务信息
            personalIncome: parseFloat(document.getElementById('personalIncome').value) || 0,
            otherDeductions: parseFloat(document.getElementById('otherDeductions').value) || 0,

            // 投资假设
            capitalGrowthRate: parseFloat(document.getElementById('capitalGrowthRate').value) || 0,
            holdingPeriod: parseInt(document.getElementById('holdingPeriod').value) || 10
        };
    }

    calculateMarginalTaxRate(income) {
        // 澳大利亚2023-24税率表
        if (income <= 18200) return 0;
        if (income <= 45000) return 0.19;
        if (income <= 120000) return 0.325;
        if (income <= 180000) return 0.37;
        return 0.45;
    }

    calculateDepreciation(purchasePrice, yearBuilt, propertyType) {
        const currentYear = new Date().getFullYear();
        const propertyAge = currentYear - yearBuilt;
        
        // Division 43 - 建筑折旧 (2.5% per year for 40 years)
        let buildingDepreciation = 0;
        if (propertyAge < 40) {
            const buildingValue = purchasePrice * 0.6; // 假设建筑占60%
            buildingDepreciation = buildingValue * 0.025;
        }

        // Division 40 - 设备折旧
        let equipmentDepreciation = 0;
        if (propertyAge < 10) {
            const equipmentValue = purchasePrice * 0.1; // 假设设备占10%
            equipmentDepreciation = equipmentValue * 0.1; // 10年折旧完
        }

        return buildingDepreciation + equipmentDepreciation;
    }

    calculateLoanPayments(loanAmount, interestRate, loanTerm, repaymentType) {
        const monthlyRate = interestRate / 100 / 12;
        const totalPayments = loanTerm * 12;

        if (repaymentType === 'interest_only') {
            return {
                monthlyPayment: loanAmount * monthlyRate,
                monthlyInterest: loanAmount * monthlyRate,
                monthlyPrincipal: 0
            };
        } else {
            // 本息同还
            const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                                 (Math.pow(1 + monthlyRate, totalPayments) - 1);
            const monthlyInterest = loanAmount * monthlyRate;
            const monthlyPrincipal = monthlyPayment - monthlyInterest;
            
            return {
                monthlyPayment,
                monthlyInterest,
                monthlyPrincipal
            };
        }
    }

    calculateYearlyAnalysis(inputs) {
        const results = [];
        const marginalTaxRate = this.calculateMarginalTaxRate(inputs.personalIncome);
        const loanPayments = this.calculateLoanPayments(
            inputs.loanAmount, 
            inputs.interestRate, 
            inputs.loanTerm, 
            inputs.repaymentType
        );
        
        let currentRent = inputs.weeklyRent * 52;
        let remainingLoan = inputs.loanAmount;
        
        for (let year = 1; year <= inputs.holdingPeriod; year++) {
            // 租金收入（考虑增长）
            const rentalIncome = currentRent;
            
            // 运营费用
            const managementFeesAmount = rentalIncome * (inputs.managementFees / 100);
            const totalOperatingExpenses = inputs.strataFees + inputs.councilRates + 
                                         inputs.waterRates + inputs.insurance + 
                                         inputs.maintenance + managementFeesAmount;
            
            // 贷款利息（如果是本息同还，利息会逐年减少）
            let annualInterest;
            if (inputs.repaymentType === 'interest_only') {
                annualInterest = loanPayments.monthlyInterest * 12;
            } else {
                // 简化计算：使用平均利息
                annualInterest = remainingLoan * (inputs.interestRate / 100);
                remainingLoan -= loanPayments.monthlyPrincipal * 12;
                if (remainingLoan < 0) remainingLoan = 0;
            }
            
            // 折旧
            const depreciation = this.calculateDepreciation(inputs.purchasePrice, inputs.yearBuilt, inputs.propertyType);
            
            // 可抵扣费用
            const totalDeductions = totalOperatingExpenses + annualInterest + depreciation;
            
            // 应税收入
            const taxableIncome = rentalIncome - totalDeductions;
            
            // 税务影响
            const taxImpact = taxableIncome * marginalTaxRate;
            
            // 现金流
            const grossCashFlow = rentalIncome - totalOperatingExpenses - (loanPayments.monthlyPayment * 12);
            const netCashFlow = grossCashFlow + (taxableIncome < 0 ? Math.abs(taxImpact) : -taxImpact);
            
            results.push({
                year,
                rentalIncome,
                totalExpenses: totalOperatingExpenses + annualInterest,
                grossCashFlow,
                taxableIncome,
                taxImpact,
                netCashFlow,
                totalDeductions,
                depreciation
            });
            
            // 更新下一年的租金
            currentRent *= (1 + inputs.rentalGrowthRate / 100);
        }
        
        return results;
    }

    calculateCapitalGains(inputs) {
        const futureValue = inputs.purchasePrice * Math.pow(1 + inputs.capitalGrowthRate / 100, inputs.holdingPeriod);
        const capitalGain = futureValue - inputs.purchasePrice - inputs.purchaseCosts;
        
        // CGT计算
        let cgtDiscount = false;
        let taxableCapitalGain = capitalGain;
        
        if (inputs.holdingPeriod > 1) {
            cgtDiscount = true;
            taxableCapitalGain = capitalGain * 0.5; // 50% CGT折扣
        }
        
        const marginalTaxRate = this.calculateMarginalTaxRate(inputs.personalIncome);
        const cgtTax = taxableCapitalGain * marginalTaxRate;
        
        return {
            futureValue,
            capitalGain,
            taxableCapitalGain,
            cgtTax,
            cgtDiscount,
            netCapitalGain: capitalGain - cgtTax
        };
    }

    calculateIRR(cashFlows) {
        // 简化的IRR计算 - 使用牛顿法
        let rate = 0.1; // 初始猜测10%
        
        for (let i = 0; i < 100; i++) {
            let npv = 0;
            let dnpv = 0;
            
            for (let j = 0; j < cashFlows.length; j++) {
                const factor = Math.pow(1 + rate, j);
                npv += cashFlows[j] / factor;
                dnpv -= j * cashFlows[j] / (factor * (1 + rate));
            }
            
            if (Math.abs(npv) < 0.01) break;
            
            rate = rate - npv / dnpv;
        }
        
        return rate;
    }

    calculateInvestment() {
        // 添加计算状态
        document.body.classList.add('calculating');
        
        setTimeout(() => {
            try {
                const inputs = this.getInputValues();
                
                // 验证必要输入
                if (!this.validateRequiredInputs(inputs)) {
                    document.body.classList.remove('calculating');
                    return;
                }
                
                // 执行计算
                const yearlyAnalysis = this.calculateYearlyAnalysis(inputs);
                const capitalGains = this.calculateCapitalGains(inputs);
                
                // 计算总结数据
                const summary = this.calculateSummary(inputs, yearlyAnalysis, capitalGains);
                
                // 显示结果
                this.displayResults(inputs, yearlyAnalysis, capitalGains, summary);
                
                // 显示结果区域
                document.getElementById('resultsSection').style.display = 'block';
                document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
                
            } catch (error) {
                console.error('计算错误:', error);
                alert('计算过程中出现错误，请检查输入数据');
            } finally {
                document.body.classList.remove('calculating');
            }
        }, 100);
    }

    validateRequiredInputs(inputs) {
        const required = ['purchasePrice', 'weeklyRent'];
        for (let field of required) {
            if (!inputs[field] || inputs[field] <= 0) {
                alert(`请输入有效的${field === 'purchasePrice' ? '购买价格' : '每周租金'}`);
                return false;
            }
        }
        return true;
    }

    calculateSummary(inputs, yearlyAnalysis, capitalGains) {
        const totalInitialInvestment = inputs.purchasePrice - inputs.loanAmount + inputs.purchaseCosts;
        const totalRentalIncome = yearlyAnalysis.reduce((sum, year) => sum + year.rentalIncome, 0);
        const totalTaxBenefits = yearlyAnalysis.reduce((sum, year) => 
            sum + (year.taxableIncome < 0 ? Math.abs(year.taxImpact) : 0), 0);
        const totalDeductions = yearlyAnalysis.reduce((sum, year) => sum + year.totalDeductions, 0);
        
        // 计算IRR
        const cashFlows = [-totalInitialInvestment];
        yearlyAnalysis.forEach(year => cashFlows.push(year.netCashFlow));
        cashFlows[cashFlows.length - 1] += capitalGains.netCapitalGain; // 最后一年加上净资本利得
        
        const irr = this.calculateIRR(cashFlows);
        
        const totalAfterTaxReturn = totalRentalIncome + capitalGains.netCapitalGain - totalInitialInvestment;
        
        // 计算收益率
        const grossRentalYield = (inputs.weeklyRent * 52 / inputs.purchasePrice) * 100;
        const netRentalYield = ((inputs.weeklyRent * 52 - yearlyAnalysis[0].totalExpenses) / inputs.purchasePrice) * 100;
        
        return {
            totalInitialInvestment,
            totalRentalIncome,
            totalTaxBenefits,
            totalDeductions,
            totalAfterTaxReturn,
            irr,
            grossRentalYield,
            netRentalYield
        };
    }

    displayResults(inputs, yearlyAnalysis, capitalGains, summary) {
        // 概览数据
        document.getElementById('totalInitialInvestment').textContent = this.formatCurrency(summary.totalInitialInvestment);
        document.getElementById('displayHoldingPeriod').textContent = `${inputs.holdingPeriod} 年`;
        document.getElementById('futurePropertyValue').textContent = this.formatCurrency(capitalGains.futureValue);
        document.getElementById('grossRentalYield').textContent = `${summary.grossRentalYield.toFixed(2)}%`;
        document.getElementById('netRentalYield').textContent = `${summary.netRentalYield.toFixed(2)}%`;
        
        // 投资回报分析
        document.getElementById('totalCapitalGrowth').textContent = this.formatCurrency(capitalGains.capitalGain);
        document.getElementById('totalRentalIncome').textContent = this.formatCurrency(summary.totalRentalIncome);
        document.getElementById('totalTaxBenefits').textContent = this.formatCurrency(summary.totalTaxBenefits);
        document.getElementById('totalAfterTaxReturn').textContent = this.formatCurrency(summary.totalAfterTaxReturn);
        document.getElementById('irr').textContent = `${(summary.irr * 100).toFixed(2)}%`;
        
        // 税务总结
        document.getElementById('totalDeductions').textContent = this.formatCurrency(summary.totalDeductions);
        document.getElementById('capitalGainsTax').textContent = this.formatCurrency(capitalGains.cgtTax);
        document.getElementById('cgtDiscountApplicable').textContent = capitalGains.cgtDiscount ? '是 (50%折扣)' : '否';
        
        // 出售时机建议
        this.displaySellingRecommendation(inputs, capitalGains, summary);
        
        // 绘制现金流图表
        this.drawCashFlowChart(yearlyAnalysis);
    }

    displaySellingRecommendation(inputs, capitalGains, summary) {
        const container = document.getElementById('sellingRecommendation');
        
        let recommendation = '';
        
        if (inputs.holdingPeriod <= 1) {
            recommendation = `
                <h4>⚠️ 短期持有风险提醒</h4>
                <p>您计划持有房产${inputs.holdingPeriod}年，这意味着您无法享受50%的资本利得税折扣。建议考虑持有超过12个月以获得税务优惠。</p>
            `;
        } else if (summary.irr > 0.08) {
            recommendation = `
                <h4>✅ 投资表现良好</h4>
                <p>根据您的假设，该投资的年化回报率为${(summary.irr * 100).toFixed(2)}%，表现良好。持有${inputs.holdingPeriod}年后出售可以享受50%的CGT折扣，是一个合理的投资期限。</p>
            `;
        } else if (summary.irr > 0.05) {
            recommendation = `
                <h4>📊 投资表现中等</h4>
                <p>该投资的年化回报率为${(summary.irr * 100).toFixed(2)}%，表现中等。建议考虑调整租金预期或寻找更好的增值潜力区域。</p>
            `;
        } else {
            recommendation = `
                <h4>⚠️ 投资回报偏低</h4>
                <p>该投资的年化回报率仅为${(summary.irr * 100).toFixed(2)}%，可能不如其他投资选择。建议重新评估投资参数或考虑其他投资机会。</p>
            `;
        }
        
        if (capitalGains.cgtDiscount) {
            recommendation += `
                <p><strong>税务优势：</strong>由于持有超过12个月，您可以享受50%的资本利得税折扣，节省税款约${this.formatCurrency(capitalGains.cgtTax)}。</p>
            `;
        }
        
        container.innerHTML = recommendation;
    }

    drawCashFlowChart(yearlyAnalysis) {
        const ctx = document.getElementById('cashFlowChart').getContext('2d');
        
        // 销毁现有图表
        if (this.cashFlowChart) {
            this.cashFlowChart.destroy();
        }
        
        const years = yearlyAnalysis.map(item => `第${item.year}年`);
        const grossCashFlow = yearlyAnalysis.map(item => item.grossCashFlow);
        const netCashFlow = yearlyAnalysis.map(item => item.netCashFlow);
        
        this.cashFlowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '税前现金流',
                    data: grossCashFlow,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }, {
                    label: '税后现金流',
                    data: netCashFlow,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '年度现金流趋势'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}

// 初始化计算器
document.addEventListener('DOMContentLoaded', () => {
    new PropertyInvestmentCalculator();
});

// 添加一些示例数据填充功能
function loadExampleData() {
    const exampleData = {
        purchasePrice: 800000,
        purchaseCosts: 40000,
        weeklyRent: 600,
        rentalGrowthRate: 3.0,
        yearBuilt: 2015,
        loanAmount: 640000,
        interestRate: 6.5,
        loanTerm: 30,
        strataFees: 3000,
        councilRates: 2000,
        waterRates: 800,
        insurance: 1200,
        maintenance: 2000,
        managementFees: 7.0,
        personalIncome: 120000,
        capitalGrowthRate: 5.0,
        holdingPeriod: 10
    };
    
    Object.keys(exampleData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = exampleData[key];
        }
    });
}

// 在控制台中提供示例数据加载功能
console.log('提示：在控制台中输入 loadExampleData() 可以加载示例数据进行测试');