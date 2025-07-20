// 房地产投资计算器主要逻辑

class PropertyInvestmentCalculator {
    constructor() {
        this.cashFlowChart = null;
        this.currentProfile = this.getProfileFromURL() || 'default';
        this.profiles = this.loadProfiles();
        this.initializeEventListeners();
        this.initializeProfiles();
        this.loadCurrentProfile();
        this.initializeURLHandling();
        
        // Wait for language manager to be ready
        if (window.languageManager) {
            this.updateProfileNames();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.updateProfileNames(), 100);
            });
        }
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.addEventListener('click', () => this.calculateInvestment());

        // Profile管理事件
        document.getElementById('profileSelect').addEventListener('change', (e) => this.switchProfile(e.target.value));
        document.getElementById('newProfileBtn').addEventListener('click', () => this.createNewProfile());
        document.getElementById('saveProfileBtn').addEventListener('click', () => this.saveCurrentProfile());
        document.getElementById('deleteProfileBtn').addEventListener('click', () => this.deleteCurrentProfile());
        document.getElementById('loadExampleBtn').addEventListener('click', () => this.loadExampleData());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        document.getElementById('importFileInput').addEventListener('change', (e) => this.handleFileImport(e));

        // 添加输入验证和自动保存
        this.addInputValidation();
        this.addAutoSave();
    }

    // Profile管理功能
    loadProfiles() {
        const saved = localStorage.getItem('propertyInvestmentProfiles');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 默认方案包含示例数据
        const defaultData = {
            purchasePrice: 800000,
            purchaseCosts: 40000,
            weeklyRent: 600,
            rentalGrowthRate: 3.0,
            propertyType: 'apartment',
            loanAmount: 640000,
            interestRate: 6.5,
            loanTerm: 30,
            repaymentType: 'interest_only',
            strataFees: 3000,
            councilRates: 2000,
            waterRates: 800,
            insurance: 1200,
            maintenance: 2000,
            managementFees: 7.0,
            personalIncome: 120000,
            otherDeductions: 5000,
            capitalGrowthRate: 5.0,
            holdingPeriod: 10
        };
        
        return {
            'default': {
                name: this.getTranslatedProfileName('default'),
                data: defaultData
            }
        };
    }

    getTranslatedProfileName(profileKey) {
        if (window.languageManager) {
            if (profileKey === 'default') {
                return window.languageManager.translate('default_profile') + ' (' + window.languageManager.translate('load_example') + ')';
            }
        }
        return profileKey === 'default' ? 'Default Profile (Example)' : profileKey;
    }

    updateProfileNames() {
        if (window.languageManager) {
            // Update default profile name
            if (this.profiles['default']) {
                this.profiles['default'].name = this.getTranslatedProfileName('default');
            }
            this.initializeProfiles();
            
            // Re-translate any existing results if they are displayed
            if (document.getElementById('resultsSection').style.display !== 'none') {
                this.updateDynamicTranslations();
            }
        }
    }

    updateDynamicTranslations() {
        // This method will be called when language changes to update dynamic content
        if (window.languageManager) {
            // Update modal titles that are set dynamically
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle && !modalTitle.hasAttribute('data-i18n')) {
                modalTitle.setAttribute('data-i18n', 'detailed_information');
                modalTitle.textContent = window.languageManager.translate('detailed_information');
            }
            
            // Re-translate the page to catch any missed elements
            window.languageManager.translatePage();
        }
    }

    saveProfiles() {
        localStorage.setItem('propertyInvestmentProfiles', JSON.stringify(this.profiles));
    }

    initializeProfiles() {
        const select = document.getElementById('profileSelect');
        select.innerHTML = '';
        
        Object.keys(this.profiles).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = this.profiles[key].name;
            select.appendChild(option);
        });
        
        // 确保当前profile存在，如果不存在则回退到default
        if (!this.profiles[this.currentProfile]) {
            this.currentProfile = 'default';
            this.updateURL();
        }
        
        select.value = this.currentProfile;
        this.updateDeleteButtonState();
    }

    switchProfile(profileKey) {
        this.saveCurrentProfileData();
        this.currentProfile = profileKey;
        this.loadCurrentProfile();
        this.updateDeleteButtonState();
        this.updateURL();
        
        // 更新下拉菜单选中状态
        const select = document.getElementById('profileSelect');
        select.value = profileKey;
    }

    createNewProfile() {
        const name = prompt('请输入新方案名称:');
        if (!name || name.trim() === '') return;
        
        // 保存当前方案数据
        this.saveCurrentProfileData();
        
        const key = 'profile_' + Date.now();
        this.profiles[key] = {
            name: name.trim(),
            data: {}
        };
        
        this.saveProfiles();
        
        // 先更新当前profile，再初始化UI
        this.currentProfile = key;
        this.initializeProfiles();
        
        // 清空表单并更新UI状态
        this.clearForm();
        this.updateDeleteButtonState();
        this.updateURL();
        
        // 显示成功提示
        this.showNotification(`新方案 "${name.trim()}" 已创建并切换`, 'success');
    }

    saveCurrentProfile() {
        if (this.currentProfile === 'default') {
            const name = prompt('请输入方案名称:', '默认方案');
            if (!name || name.trim() === '') return;
            this.profiles[this.currentProfile].name = name.trim();
        }
        
        this.saveCurrentProfileData();
        this.saveProfiles();
        this.initializeProfiles();
        
        // 显示保存成功提示
        this.showNotification('方案已保存', 'success');
    }

    deleteCurrentProfile() {
        if (this.currentProfile === 'default') {
            alert('默认方案不能删除');
            return;
        }
        
        if (!confirm('确定要删除当前方案吗？')) return;
        
        delete this.profiles[this.currentProfile];
        this.saveProfiles();
        this.currentProfile = 'default';
        this.initializeProfiles();
        this.loadCurrentProfile();
    }

    updateDeleteButtonState() {
        const deleteBtn = document.getElementById('deleteProfileBtn');
        deleteBtn.disabled = this.currentProfile === 'default';
        deleteBtn.style.opacity = this.currentProfile === 'default' ? '0.5' : '1';
    }

    saveCurrentProfileData() {
        const data = this.getInputValues();
        this.profiles[this.currentProfile].data = data;
    }

    loadCurrentProfile() {
        const data = this.profiles[this.currentProfile].data;
        if (Object.keys(data).length === 0) {
            this.clearForm();
            return;
        }
        
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element && data[key] !== undefined && data[key] !== null) {
                element.value = data[key];
            }
        });
    }

    clearForm() {
        // 清空所有输入字段
        const inputs = document.querySelectorAll('input[type="number"], select');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
        
        // 隐藏结果区域
        document.getElementById('resultsSection').style.display = 'none';
    }

    addAutoSave() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveCurrentProfileData();
                this.saveProfiles();
            });
        });
    }

    // URL处理功能
    getProfileFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('profile');
    }

    updateURL() {
        const url = new URL(window.location);
        if (this.currentProfile === 'default') {
            url.searchParams.delete('profile');
        } else {
            url.searchParams.set('profile', this.currentProfile);
        }
        window.history.replaceState({}, '', url);
    }

    initializeURLHandling() {
        // 监听浏览器前进后退按钮
        window.addEventListener('popstate', () => {
            const profileFromURL = this.getProfileFromURL() || 'default';
            if (profileFromURL !== this.currentProfile && this.profiles[profileFromURL]) {
                this.currentProfile = profileFromURL;
                this.initializeProfiles();
                this.loadCurrentProfile();
                this.updateDeleteButtonState();
            }
        });
    }

    loadExampleData() {
        const exampleData = {
            purchasePrice: 800000,
            purchaseCosts: 40000,
            weeklyRent: 600,
            rentalGrowthRate: 3.0,
            propertyType: 'apartment',
            yearBuilt: 2015,
            loanAmount: 640000,
            interestRate: 6.5,
            loanTerm: 30,
            repaymentType: 'interest_only',
            strataFees: 3000,
            councilRates: 2000,
            waterRates: 800,
            insurance: 1200,
            maintenance: 2000,
            managementFees: 7.0,
            personalIncome: 120000,
            otherDeductions: 5000,
            capitalGrowthRate: 5.0,
            holdingPeriod: 10
        };
        
        Object.keys(exampleData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = exampleData[key];
            }
        });
        
        // 保存到当前profile
        this.saveCurrentProfileData();
        this.saveProfiles();
        
        // 显示加载成功提示
        this.showNotification('示例数据已加载到当前方案', 'success');
    }

    // 导出数据功能
    exportData() {
        try {
            // 保存当前方案数据
            this.saveCurrentProfileData();
            
            // 准备导出数据
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                currentProfile: this.currentProfile,
                profiles: this.profiles
            };
            
            // 创建下载链接
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            // 创建下载元素
            const link = document.createElement('a');
            link.href = url;
            link.download = `property-investment-profiles-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理URL对象
            URL.revokeObjectURL(url);
            
            this.showNotification('数据导出成功', 'success');
        } catch (error) {
            console.error('导出失败:', error);
            this.showNotification('导出失败，请重试', 'error');
        }
    }

    // 导入数据功能
    importData() {
        const fileInput = document.getElementById('importFileInput');
        fileInput.click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/json') {
            this.showNotification('请选择有效的JSON文件', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                this.processImportData(importData);
            } catch (error) {
                console.error('导入失败:', error);
                this.showNotification('文件格式错误，导入失败', 'error');
            }
        };
        
        reader.readAsText(file);
        
        // 清空文件输入，允许重复选择同一文件
        event.target.value = '';
    }

    processImportData(importData) {
        try {
            // 验证数据格式
            if (!importData.profiles || typeof importData.profiles !== 'object') {
                throw new Error('无效的数据格式');
            }
            
            // 询问用户导入方式
            const importType = confirm(
                '选择导入方式：\n' +
                '确定 = 合并导入（保留现有方案）\n' +
                '取消 = 完全替换（删除现有方案）'
            );
            
            if (importType) {
                // 合并导入
                this.mergeProfiles(importData.profiles);
                this.showNotification('数据合并导入成功', 'success');
            } else {
                // 完全替换
                this.replaceProfiles(importData);
                this.showNotification('数据完全导入成功', 'success');
            }
            
        } catch (error) {
            console.error('处理导入数据失败:', error);
            this.showNotification('导入数据处理失败', 'error');
        }
    }

    mergeProfiles(importProfiles) {
        // 合并方案，避免重复键名
        Object.keys(importProfiles).forEach(key => {
            let newKey = key;
            let counter = 1;
            
            // 如果键名已存在，添加后缀
            while (this.profiles[newKey]) {
                if (key === 'default') {
                    newKey = `default_imported_${counter}`;
                } else {
                    newKey = `${key}_${counter}`;
                }
                counter++;
            }
            
            this.profiles[newKey] = {
                ...importProfiles[key],
                name: newKey !== key ? `${importProfiles[key].name} (导入)` : importProfiles[key].name
            };
        });
        
        this.saveProfiles();
        this.initializeProfiles();
    }

    replaceProfiles(importData) {
        // 完全替换所有方案
        this.profiles = importData.profiles;
        
        // 设置当前方案
        if (importData.currentProfile && this.profiles[importData.currentProfile]) {
            this.currentProfile = importData.currentProfile;
        } else {
            this.currentProfile = Object.keys(this.profiles)[0] || 'default';
        }
        
        this.saveProfiles();
        this.initializeProfiles();
        this.loadCurrentProfile();
        this.updateURL();
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
            
            // 可抵扣费用
            const totalDeductions = totalOperatingExpenses + annualInterest;
            
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
                totalDeductions
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
        yearlyAnalysis.forEach((year, index) => {
            if (index === yearlyAnalysis.length - 1) {
                // 最后一年：年度现金流 + (出售收入 - 贷款剩余金额 - CGT)
                const remainingLoan = this.calculateRemainingLoan(inputs, inputs.holdingPeriod);
                const netSaleProceeds = capitalGains.futureValue - remainingLoan - capitalGains.cgtTax;
                cashFlows.push(year.netCashFlow + netSaleProceeds);
            } else {
                // 其他年份：只有正常现金流
                cashFlows.push(year.netCashFlow);
            }
        });
        
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
        const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
        
        // 概览数据
        document.getElementById('totalInitialInvestment').textContent = this.formatCurrency(summary.totalInitialInvestment);
        document.getElementById('displayHoldingPeriod').textContent = `${inputs.holdingPeriod} ${t('years')}`;
        document.getElementById('futurePropertyValue').textContent = this.formatCurrency(capitalGains.futureValue);
        document.getElementById('grossRentalYield').textContent = `${summary.grossRentalYield.toFixed(2)}%`;
        document.getElementById('netRentalYield').textContent = `${summary.netRentalYield.toFixed(2)}%`;
        
        // 投资回报分析
        document.getElementById('totalCapitalGrowth').textContent = this.formatCurrency(capitalGains.capitalGain);
        document.getElementById('totalRentalIncome').textContent = this.formatCurrency(summary.totalRentalIncome);
        document.getElementById('totalTaxBenefits').textContent = this.formatCurrency(summary.totalTaxBenefits);
        document.getElementById('totalAfterTaxReturn').textContent = this.formatCurrency(summary.totalAfterTaxReturn);
        document.getElementById('irr').textContent = `${(summary.irr * 100).toFixed(2)}%`;
        
        // 存储数据供弹窗使用
        this.currentYearlyAnalysis = yearlyAnalysis;
        this.currentInputs = inputs;
        
        // 税务总结
        document.getElementById('totalDeductions').textContent = this.formatCurrency(summary.totalDeductions);
        document.getElementById('capitalGainsTax').textContent = this.formatCurrency(capitalGains.cgtTax);
        document.getElementById('cgtDiscountApplicable').textContent = capitalGains.cgtDiscount ? `${t('yes')}` : t('no');
        
        // 出售时机建议
        this.displaySellingRecommendation(inputs, capitalGains, summary);
        
        // 绘制现金流图表
        this.drawCashFlowChart(yearlyAnalysis);
    }

    displaySellingRecommendation(inputs, capitalGains, summary) {
        const container = document.getElementById('sellingRecommendation');
        const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
        
        let recommendation = '';
        
        if (inputs.holdingPeriod <= 1) {
            recommendation = `
                <h4>⚠️ ${t('short_term_holding_risk')}</h4>
                <p>${t('short_term_holding_warning').replace('{years}', inputs.holdingPeriod)}</p>
            `;
        } else if (summary.irr > 0.08) {
            recommendation = `
                <h4>✅ ${t('good_investment_performance')}</h4>
                <p>${t('good_performance_description').replace('{irr}', (summary.irr * 100).toFixed(2)).replace('{years}', inputs.holdingPeriod)}</p>
            `;
        } else if (summary.irr > 0.05) {
            recommendation = `
                <h4>📊 ${t('moderate_investment_performance')}</h4>
                <p>${t('moderate_performance_description').replace('{irr}', (summary.irr * 100).toFixed(2))}</p>
            `;
        } else {
            recommendation = `
                <h4>⚠️ ${t('poor_investment_performance')}</h4>
                <p>${t('poor_performance_description').replace('{irr}', (summary.irr * 100).toFixed(2))}</p>
            `;
        }
        
        if (capitalGains.cgtDiscount) {
            recommendation += `
                <p><strong>${t('tax_advantage')}:</strong> ${t('cgt_discount_benefit_description').replace('{amount}', this.formatCurrency(capitalGains.cgtTax))}</p>
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
        
        const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
        const years = yearlyAnalysis.map(item => `${t('year')} ${item.year}`);
        const grossCashFlow = yearlyAnalysis.map(item => item.grossCashFlow);
        const netCashFlow = yearlyAnalysis.map(item => item.netCashFlow);
        
        this.cashFlowChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: t('pre_tax_cash_flow'),
                    data: grossCashFlow,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }, {
                    label: t('after_tax_cash_flow'),
                    data: netCashFlow,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: t('cash_flow_chart_title'),
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        color: '#495057'
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       new Intl.NumberFormat('en-AU', {
                                           style: 'currency',
                                           currency: 'AUD',
                                           minimumFractionDigits: 0
                                       }).format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#495057',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            color: '#495057',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return new Intl.NumberFormat('en-AU', {
                                    style: 'currency',
                                    currency: 'AUD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#fff',
                        hoverBorderWidth: 2
                    }
                }
            }
        });
    }

    generateModalContent(yearlyAnalysis, inputs) {
        const marginalTaxRate = this.calculateMarginalTaxRate(inputs.personalIncome);
        
        let totalBenefits = 0;
        let benefitYears = 0;
        
        // 计算总计数据
        yearlyAnalysis.forEach(year => {
            if (year.taxableIncome < 0) {
                totalBenefits += Math.abs(year.taxImpact);
                benefitYears++;
            }
        });
        
        // 更新弹窗摘要
        const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
        document.getElementById('modalTotalBenefits').textContent = this.formatCurrency(totalBenefits);
        document.getElementById('modalBenefitYears').textContent = `${benefitYears} ${t('years')}`;
        document.getElementById('modalTaxRate').textContent = `${(marginalTaxRate * 100).toFixed(1)}%`;
        
        // 生成年度明细
        this.generateYearlyDetail(yearlyAnalysis, inputs);
        
        // 生成抵扣分解
        this.generateBreakdownDetail(yearlyAnalysis, inputs);
    }

    generateYearlyDetail(yearlyAnalysis, inputs) {
        const marginalTaxRate = this.calculateMarginalTaxRate(inputs.personalIncome);
        const container = document.getElementById('yearlyDetailContent');
        const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
        
        let html = '';
        
        yearlyAnalysis.forEach(year => {
            const hasBenefit = year.taxableIncome < 0;
            const benefit = hasBenefit ? Math.abs(year.taxImpact) : 0;
            
            // 计算详细的抵扣项目
            const managementFeesAmount = year.rentalIncome * (inputs.managementFees / 100);
            const operatingExpenses = inputs.strataFees + inputs.councilRates + inputs.waterRates + 
                                    inputs.insurance + inputs.maintenance + managementFeesAmount;
            
            // 计算贷款利息
            const loanPayments = this.calculateLoanPayments(inputs.loanAmount, inputs.interestRate, inputs.loanTerm, inputs.repaymentType);
            const annualInterest = loanPayments.monthlyInterest * 12;
            
            html += `
                <div class="year-detail-card">
                    <div class="year-header">
                        <span class="year-title">${t('year')} ${year.year}</span>
                        <span class="year-benefit-amount ${hasBenefit ? 'positive' : 'zero'}">
                            ${hasBenefit ? this.formatCurrency(benefit) : t('no') + ' ' + t('total_tax_benefits')}
                        </span>
                    </div>
                    <div class="year-details">
                        <div class="detail-grid">
                            <div class="detail-section">
                                <h6>${t('rental_income')} ${t('expense_breakdown')}</h6>
                                <div class="detail-item">
                                    <span class="detail-label">${t('rental_income')}</span>
                                    <span class="detail-value">${this.formatCurrency(year.rentalIncome)}</span>
                                </div>
                            </div>
                            <div class="detail-section">
                                <h6>${t('deduction_breakdown')} ${t('expense_breakdown')}</h6>
                                <div class="detail-item">
                                    <span class="detail-label">${t('loan_interest')}</span>
                                    <span class="detail-value">${this.formatCurrency(annualInterest)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${t('strata_fees')}</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.strataFees)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${t('council_rates')}</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.councilRates)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${t('water_rates')}</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.waterRates)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${t('insurance')}</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.insurance)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${t('maintenance')}</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.maintenance)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${t('management_fees')}</span>
                                    <span class="detail-value">${this.formatCurrency(managementFeesAmount)}</span>
                                </div>
                                <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                    <span class="detail-label"><strong>${t('total_deductions')}</strong></span>
                                    <span class="detail-value"><strong>${this.formatCurrency(year.totalDeductions)}</strong></span>
                                </div>
                            </div>
                        </div>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">${t('rental_income')} - ${t('total_deductions')}</span>
                                <span class="detail-value">${this.formatCurrency(year.taxableIncome)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('marginal_tax_rate')}</span>
                                <span class="detail-value">${(marginalTaxRate * 100).toFixed(1)}%</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label"><strong>${t('tax_impact')}</strong></span>
                                <span class="detail-value"><strong>
                                    ${hasBenefit ? 
                                        `${t('tax_savings')} ${this.formatCurrency(benefit)}` : 
                                        `${t('tax_payable')} ${this.formatCurrency(Math.abs(year.taxImpact))}`
                                    }
                                </strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    generateBreakdownDetail(yearlyAnalysis, inputs) {
        const container = document.getElementById('breakdownDetailContent');
        
        // 计算各项费用的累计金额
        let totalInterest = 0;
        let totalOperating = 0;
        let totalDeductions = 0;
        
        yearlyAnalysis.forEach(year => {
            const loanPayments = this.calculateLoanPayments(inputs.loanAmount, inputs.interestRate, inputs.loanTerm, inputs.repaymentType);
            const annualInterest = loanPayments.monthlyInterest * 12;
            const managementFeesAmount = year.rentalIncome * (inputs.managementFees / 100);
            const operatingExpenses = inputs.strataFees + inputs.councilRates + inputs.waterRates + 
                                    inputs.insurance + inputs.maintenance + managementFeesAmount;
            
            totalInterest += annualInterest;
            totalOperating += operatingExpenses;
            totalDeductions += year.totalDeductions;
        });
        
        const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
        
        const html = `
            <div class="breakdown-summary">
                <h5>${t('cumulative_deductible_expense_breakdown')} (${inputs.holdingPeriod} ${t('years')})</h5>
                
                <div class="breakdown-categories">
                    <div class="category-card">
                        <h6>${t('loan_interest')}</h6>
                        <div class="category-amount">${this.formatCurrency(totalInterest)}</div>
                        <div class="category-percentage">${((totalInterest / totalDeductions) * 100).toFixed(1)}%</div>
                        <small>${t('investment_property_loan_interest')}</small>
                    </div>
                    
                    <div class="category-card">
                        <h6>${t('operating_expenses')}</h6>
                        <div class="category-amount">${this.formatCurrency(totalOperating)}</div>
                        <div class="category-percentage">${((totalOperating / totalDeductions) * 100).toFixed(1)}%</div>
                        <small>${t('property_fees_council_insurance')}</small>
                    </div>
                </div>
                
                <div class="breakdown-details">
                    <h6>${t('operating_expenses')} ${t('expense_breakdown')}</h6>
                    <div class="detail-breakdown">
                        <div class="breakdown-item">
                            <span>${t('strata_fees')}</span>
                            <span>${this.formatCurrency(inputs.strataFees * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${t('council_rates')}</span>
                            <span>${this.formatCurrency(inputs.councilRates * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${t('water_rates')}</span>
                            <span>${this.formatCurrency(inputs.waterRates * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${t('insurance')}</span>
                            <span>${this.formatCurrency(inputs.insurance * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${t('maintenance')}</span>
                            <span>${this.formatCurrency(inputs.maintenance * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${t('management_fees')}</span>
                            <span>${this.formatCurrency(yearlyAnalysis.reduce((sum, year) => sum + (year.rentalIncome * inputs.managementFees / 100), 0))}</span>
                        </div>
                        <div class="breakdown-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                            <span><strong>${t('total_deductions')}</strong></span>
                            <span><strong>${this.formatCurrency(totalDeductions)}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    calculateBreakEvenScenarios(inputs, yearlyAnalysis, capitalGains) {
        // 计算盈亏平衡所需的参数调整
        const currentIRR = this.calculateIRR(this.buildCashFlowArray(inputs, yearlyAnalysis, capitalGains));
        
        return {
            rentIncrease: this.calculateRequiredRentIncrease(inputs, yearlyAnalysis, capitalGains),
            rateDecrease: this.calculateRequiredRateDecrease(inputs, yearlyAnalysis, capitalGains),
            growthIncrease: this.calculateRequiredGrowthIncrease(inputs, yearlyAnalysis, capitalGains),
            priceDecrease: this.calculateRequiredPriceDecrease(inputs, yearlyAnalysis, capitalGains)
        };
    }

    buildCashFlowArray(inputs, yearlyAnalysis, capitalGains) {
        const summary = this.calculateSummary(inputs, yearlyAnalysis, capitalGains);
        const cashFlows = [-summary.totalInitialInvestment];
        
        yearlyAnalysis.forEach((year, index) => {
            if (index === yearlyAnalysis.length - 1) {
                // 最后一年：年度现金流 + (出售收入 - 贷款剩余金额 - CGT)
                const remainingLoan = this.calculateRemainingLoan(inputs, inputs.holdingPeriod);
                const netSaleProceeds = capitalGains.futureValue - remainingLoan - capitalGains.cgtTax;
                cashFlows.push(year.netCashFlow + netSaleProceeds);
            } else {
                // 其他年份：只有正常现金流
                cashFlows.push(year.netCashFlow);
            }
        });
        
        return cashFlows;
    }

    calculateRequiredRentIncrease(inputs, yearlyAnalysis, capitalGains) {
        // 简化计算：估算需要多少租金增长才能达到0% IRR
        const currentTotalRental = yearlyAnalysis.reduce((sum, year) => sum + year.rentalIncome, 0);
        const requiredIncrease = Math.abs(capitalGains.capitalGain) / inputs.holdingPeriod;
        return (requiredIncrease / currentTotalRental) * 100;
    }

    calculateRequiredRateDecrease(inputs, yearlyAnalysis, capitalGains) {
        // 估算需要降低多少利率才能达到盈亏平衡
        return Math.min(2.0, Math.abs(this.calculateIRR(this.buildCashFlowArray(inputs, yearlyAnalysis, capitalGains))) * 100);
    }

    calculateRequiredGrowthIncrease(inputs, yearlyAnalysis, capitalGains) {
        // 估算需要多少额外增值率才能达到盈亏平衡
        return Math.abs(this.calculateIRR(this.buildCashFlowArray(inputs, yearlyAnalysis, capitalGains))) * 100;
    }

    calculateRequiredPriceDecrease(inputs, yearlyAnalysis, capitalGains) {
        // 估算需要降低多少购买价格才能达到盈亏平衡
        const summary = this.calculateSummary(inputs, yearlyAnalysis, capitalGains);
        return Math.min(20, (Math.abs(summary.totalAfterTaxReturn) / inputs.purchasePrice) * 100);
    }

    calculateRemainingLoan(inputs, years) {
        if (inputs.repaymentType === 'interest_only') {
            // 只付利息贷款：本金不变
            return inputs.loanAmount;
        } else {
            // 本息同还贷款：计算剩余本金
            const monthlyRate = inputs.interestRate / 100 / 12;
            const totalPayments = inputs.loanTerm * 12;
            const paymentsCompleted = years * 12;
            
            if (paymentsCompleted >= totalPayments) {
                return 0; // 贷款已还清
            }
            
            // 计算月还款额
            const monthlyPayment = inputs.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                                 (Math.pow(1 + monthlyRate, totalPayments) - 1);
            
            // 计算剩余本金
            const remainingPayments = totalPayments - paymentsCompleted;
            const remainingBalance = monthlyPayment * (Math.pow(1 + monthlyRate, remainingPayments) - 1) / 
                                   (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments));
            
            return Math.max(0, remainingBalance);
        }
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
    window.calculator = new PropertyInvestmentCalculator();
});

// 添加一些示例数据填充功能
function loadExampleData() {
    const exampleData = {
        purchasePrice: 800000,
        purchaseCosts: 40000,
        weeklyRent: 600,
        rentalGrowthRate: 3.0,
        propertyType: 'apartment',
        loanAmount: 640000,
        interestRate: 6.5,
        loanTerm: 30,
        repaymentType: 'interest_only',
        strataFees: 3000,
        councilRates: 2000,
        waterRates: 800,
        insurance: 1200,
        maintenance: 2000,
        managementFees: 7.0,
        personalIncome: 120000,
        otherDeductions: 5000,
        capitalGrowthRate: 5.0,
        holdingPeriod: 10
    };
    
    Object.keys(exampleData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = exampleData[key];
        }
    });
    
    // 显示加载成功提示
    if (window.calculator) {
        window.calculator.showNotification('示例数据已加载', 'success');
    }
}

// 弹窗控制函数
function openTaxBenefitsModal() {
    if (window.calculator && window.calculator.currentYearlyAnalysis) {
        window.calculator.generateModalContent(window.calculator.currentYearlyAnalysis, window.calculator.currentInputs);
        document.getElementById('taxBenefitsModal').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    } else {
        alert('请先计算投资回报以查看详细信息');
    }
}

function closeTaxBenefitsModal() {
    document.getElementById('taxBenefitsModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchTab(tabName) {
    // 隐藏所有标签页
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // 移除所有按钮的active状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // 激活对应的按钮
    event.target.classList.add('active');
}

// 通用弹窗控制函数
function openDetailModal(config) {
    if (!window.calculator || !window.calculator.currentYearlyAnalysis) {
        alert('请先计算投资回报以查看详细信息');
        return;
    }
    
    // 设置弹窗标题和内容
    document.getElementById('modalTitle').textContent = config.title;
    document.getElementById('modalSummaryTitle').textContent = config.summaryTitle;
    document.getElementById('modalSummaryAmount').textContent = config.summaryAmount;
    
    // 生成摘要详情
    const summaryDetails = document.getElementById('modalSummaryDetails');
    summaryDetails.innerHTML = config.summaryDetails || '';
    
    // 生成标签页
    const tabsContainer = document.getElementById('modalTabs');
    tabsContainer.innerHTML = config.tabs.map((tab, index) => 
        `<button class="tab-btn ${index === 0 ? 'active' : ''}" onclick="switchDetailTab('${tab.id}')">${tab.name}</button>`
    ).join('');
    
    // 生成标签页内容
    const contentContainer = document.getElementById('modalTabContent');
    contentContainer.innerHTML = config.tabs.map((tab, index) => 
        `<div id="${tab.id}" class="tab-pane ${index === 0 ? 'active' : ''}">${tab.content}</div>`
    ).join('');
    
    // 显示弹窗
    document.getElementById('detailModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchDetailTab(tabId) {
    // 隐藏所有标签页
    document.querySelectorAll('#modalTabContent .tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // 移除所有按钮的active状态
    document.querySelectorAll('#modalTabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签页
    document.getElementById(tabId).classList.add('active');
    
    // 激活对应的按钮
    event.target.classList.add('active');
}

// 各个指标的弹窗函数
function openInitialInvestmentModal() {
    const inputs = window.calculator.currentInputs;
    const downPayment = inputs.purchasePrice - inputs.loanAmount;
    const totalInitial = downPayment + inputs.purchaseCosts;
    
    const config = {
        title: window.languageManager.translate('initial_investment_detailed_analysis'),
        summaryTitle: window.languageManager.translate('initial_investment'),
        summaryAmount: window.calculator.formatCurrency(totalInitial),
        summaryDetails: `
            <span>${window.languageManager.translate('down_payment')}: <strong>${window.calculator.formatCurrency(downPayment)}</strong></span>
            <span>${window.languageManager.translate('purchase_costs')}: <strong>${window.calculator.formatCurrency(inputs.purchaseCosts)}</strong></span>
        `,
        tabs: [
            {
                id: 'initialBreakdown',
                name: window.languageManager.translate('cost_breakdown'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('initial_investment')} ${window.languageManager.translate('return_composition')}</h5>
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${window.languageManager.translate('down_payment')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(downPayment)}</div>
                                <div class="category-percentage">${((downPayment / totalInitial) * 100).toFixed(1)}%</div>
                                <small>${window.languageManager.translate('property_price')} - ${window.languageManager.translate('loan_amount')}</small>
                            </div>
                            <div class="category-card">
                                <h6>${window.languageManager.translate('purchase_costs')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(inputs.purchaseCosts)}</div>
                                <div class="category-percentage">${((inputs.purchaseCosts / totalInitial) * 100).toFixed(1)}%</div>
                                <small>Stamp duty, legal fees, transfer fees, etc.</small>
                            </div>
                        </div>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('property_price')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(inputs.purchasePrice)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('loan_amount')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(inputs.loanAmount)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('loan_ratio_lvr')}</span>
                                <span class="detail-value">${((inputs.loanAmount / inputs.purchasePrice) * 100).toFixed(1)}%</span>
                            </div>
                            <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                <span class="detail-label"><strong>${window.languageManager.translate('initial_investment_total')}</strong></span>
                                <span class="detail-value"><strong>${window.calculator.formatCurrency(totalInitial)}</strong></span>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'initialTips',
                name: window.languageManager.translate('investment_advice'),
                content: `
                    <div class="tax-explanation-detailed">
                        <h5>${window.languageManager.translate('initial_investment_optimization_advice')}</h5>
                        <div class="explanation-section">
                            <h6>1. ${window.languageManager.translate('loan_ratio_lvr_consideration')}</h6>
                            <p>${window.languageManager.translate('current_lvr')}: ${((inputs.loanAmount / inputs.purchasePrice) * 100).toFixed(1)}%</p>
                            <ul>
                                <li><strong>${window.languageManager.translate('below_80_percent')}</strong></li>
                                <li><strong>${window.languageManager.translate('between_80_95_percent')}</strong></li>
                                <li><strong>${window.languageManager.translate('recommendation')}:</strong> ${inputs.loanAmount / inputs.purchasePrice <= 0.8 ? window.languageManager.translate('current_lvr_ideal') : window.languageManager.translate('consider_increasing_down_payment')}</li>
                            </ul>
                        </div>
                        <div class="explanation-section">
                            <h6>2. ${window.languageManager.translate('purchase_cost_optimization')}</h6>
                            <ul>
                                <li><strong>${window.languageManager.translate('stamp_duty')}</strong></li>
                                <li><strong>${window.languageManager.translate('legal_fees')}</strong></li>
                                <li><strong>${window.languageManager.translate('property_inspection')}</strong></li>
                                <li><strong>${window.languageManager.translate('loan_fees')}</strong></li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

function openCapitalGrowthModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const futureValue = inputs.purchasePrice * Math.pow(1 + inputs.capitalGrowthRate / 100, inputs.holdingPeriod);
    const capitalGain = futureValue - inputs.purchasePrice - inputs.purchaseCosts;
    
    const config = {
        title: window.languageManager.translate('capital_growth_detailed_analysis'),
        summaryTitle: window.languageManager.translate('capital_growth'),
        summaryAmount: window.calculator.formatCurrency(capitalGain),
        summaryDetails: `
            <span>${window.languageManager.translate('purchase_price')}: <strong>${window.calculator.formatCurrency(inputs.purchasePrice)}</strong></span>
            <span>${window.languageManager.translate('expected_sale_price')}: <strong>${window.calculator.formatCurrency(futureValue)}</strong></span>
        `,
        tabs: [
            {
                id: 'capitalBreakdown',
                name: window.languageManager.translate('growth_breakdown'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('capital_growth_composition')}</h5>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('initial_purchase_price')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(inputs.purchasePrice)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('annual_growth_rate')}</span>
                                <span class="detail-value">${inputs.capitalGrowthRate.toFixed(1)}%</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('holding_years')}</span>
                                <span class="detail-value">${inputs.holdingPeriod} ${window.languageManager.translate('years')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('expected_sale_price')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(futureValue)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('minus_purchase_costs')}</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(inputs.purchaseCosts)}</span>
                            </div>
                            <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                <span class="detail-label"><strong>${window.languageManager.translate('net_capital_growth')}</strong></span>
                                <span class="detail-value"><strong>${window.calculator.formatCurrency(capitalGain)}</strong></span>
                            </div>
                        </div>
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${window.languageManager.translate('annualized_growth_rate')}</h6>
                                <div class="category-amount">${inputs.capitalGrowthRate.toFixed(1)}%</div>
                                <div class="category-percentage">Compound Growth</div>
                                <small>Based on historical data forecast</small>
                            </div>
                            <div class="category-card">
                                <h6>${window.languageManager.translate('total_growth_multiple')}</h6>
                                <div class="category-amount">${(futureValue / inputs.purchasePrice).toFixed(2)}x</div>
                                <div class="category-percentage">${inputs.holdingPeriod} ${window.languageManager.translate('years')}</div>
                                <small>${window.languageManager.translate('property_value_growth_multiple')}</small>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'capitalTips',
                name: window.languageManager.translate('growth_analysis'),
                content: `
                    <div class="tax-explanation-detailed">
                        <h5>${window.languageManager.translate('capital_growth_impact_factors')}</h5>
                        <div class="explanation-section">
                            <h6>1. ${window.languageManager.translate('market_factors')}</h6>
                            <ul>
                                <li><strong>${window.languageManager.translate('location')}</strong></li>
                                <li><strong>${window.languageManager.translate('supply_demand')}</strong></li>
                                <li><strong>${window.languageManager.translate('infrastructure')}</strong></li>
                                <li><strong>${window.languageManager.translate('economic_environment')}</strong></li>
                            </ul>
                        </div>
                        <div class="explanation-section">
                            <h6>2. ${window.languageManager.translate('risk_warning')}</h6>
                            <ul>
                                <li><strong>${window.languageManager.translate('market_volatility')}</strong></li>
                                <li><strong>${window.languageManager.translate('policy_impact')}</strong></li>
                                <li><strong>${window.languageManager.translate('forecast_limitations')}</strong></li>
                                <li><strong>${window.languageManager.translate('conservative_estimate_advice')}</strong></li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

function openRentalIncomeModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const totalRentalIncome = yearlyAnalysis.reduce((sum, year) => sum + year.rentalIncome, 0);
    
    const config = {
        title: window.languageManager.translate('rental_income_detailed_analysis'),
        summaryTitle: window.languageManager.translate('total_rental_income'),
        summaryAmount: window.calculator.formatCurrency(totalRentalIncome),
        summaryDetails: `
            <span>${window.languageManager.translate('initial_weekly_rent')}: <strong>${window.calculator.formatCurrency(inputs.weeklyRent)}</strong></span>
            <span>${window.languageManager.translate('rental_growth_rate')}: <strong>${inputs.rentalGrowthRate.toFixed(1)}%</strong></span>
        `,
        tabs: [
            {
                id: 'rentalBreakdown',
                name: window.languageManager.translate('rental_details'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('annual_rental_income_details')}</h5>
                        ${yearlyAnalysis.map(year => `
                            <div class="year-detail-card">
                                <div class="year-header">
                                    <span class="year-title">${window.languageManager.translate('year')} ${year.year}</span>
                                    <span class="year-benefit-amount positive">${window.calculator.formatCurrency(year.rentalIncome)}</span>
                                </div>
                                <div class="year-details">
                                    <div class="calculation-summary">
                                        <div class="detail-item">
                                            <span class="detail-label">${window.languageManager.translate('weekly_rent')}</span>
                                            <span class="detail-value">${window.calculator.formatCurrency(year.rentalIncome / 52)}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-label">${window.languageManager.translate('monthly_rent')}</span>
                                            <span class="detail-value">${window.calculator.formatCurrency(year.rentalIncome / 12)}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="detail-label">${window.languageManager.translate('annual_rent')}</span>
                                            <span class="detail-value">${window.calculator.formatCurrency(year.rentalIncome)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `
            },
            {
                id: 'rentalTips',
                name: window.languageManager.translate('rental_optimization'),
                content: `
                    <div class="tax-explanation-detailed">
                        <h5>${window.languageManager.translate('rental_income_optimization_strategy')}</h5>
                        <div class="explanation-section">
                            <h6>1. ${window.languageManager.translate('improve_rental_income')}</h6>
                            <ul>
                                <li><strong>${window.languageManager.translate('property_renovation')}</strong></li>
                                <li><strong>${window.languageManager.translate('facility_improvement')}</strong></li>
                                <li><strong>${window.languageManager.translate('regular_adjustment')}</strong></li>
                                <li><strong>${window.languageManager.translate('quality_tenants')}</strong></li>
                            </ul>
                        </div>
                        <div class="explanation-section">
                            <h6>2. ${window.languageManager.translate('rental_yield')}</h6>
                            <p>${window.languageManager.translate('current_gross_rental_yield')}: ${((inputs.weeklyRent * 52 / inputs.purchasePrice) * 100).toFixed(2)}%</p>
                            <ul>
                                <li><strong>${window.languageManager.translate('excellent_above_6')}</strong></li>
                                <li><strong>${window.languageManager.translate('good_4_to_6')}</strong></li>
                                <li><strong>${window.languageManager.translate('average_3_to_4')}</strong></li>
                                <li><strong>${window.languageManager.translate('low_below_3')}</strong></li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

function openAfterTaxReturnModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const capitalGains = window.calculator.calculateCapitalGains(inputs);
    const summary = window.calculator.calculateSummary(inputs, yearlyAnalysis, capitalGains);
    
    const config = {
        title: window.languageManager.translate('after_tax_return_detailed_analysis'),
        summaryTitle: window.languageManager.translate('total_return'),
        summaryAmount: window.calculator.formatCurrency(summary.totalAfterTaxReturn),
        summaryDetails: `
            <span>${window.languageManager.translate('investment_term')}: <strong>${inputs.holdingPeriod} ${window.languageManager.translate('years')}</strong></span>
            <span>${window.languageManager.translate('total_investment')}: <strong>${window.calculator.formatCurrency(summary.totalInitialInvestment)}</strong></span>
        `,
        tabs: [
            {
                id: 'returnBreakdown',
                name: window.languageManager.translate('return_composition'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('after_tax_total_return_composition')}</h5>
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${window.languageManager.translate('rental_income')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(summary.totalRentalIncome)}</div>
                                <div class="category-percentage">${((summary.totalRentalIncome / (summary.totalRentalIncome + capitalGains.netCapitalGain)) * 100).toFixed(1)}%</div>
                                <small>${window.languageManager.translate('cumulative_rental_income')}</small>
                            </div>
                            <div class="category-card">
                                <h6>${window.languageManager.translate('capital_appreciation')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(capitalGains.netCapitalGain)}</div>
                                <div class="category-percentage">${((capitalGains.netCapitalGain / (summary.totalRentalIncome + capitalGains.netCapitalGain)) * 100).toFixed(1)}%</div>
                                <small>${window.languageManager.translate('after_tax_net_appreciation')}</small>
                            </div>
                        </div>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('initial_investment')}</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(summary.totalInitialInvestment)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('cumulative_rental_income')}</span>
                                <span class="detail-value">+${window.calculator.formatCurrency(summary.totalRentalIncome)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('net_capital_appreciation')}</span>
                                <span class="detail-value">+${window.calculator.formatCurrency(capitalGains.netCapitalGain)}</span>
                            </div>
                            <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                <span class="detail-label"><strong>${window.languageManager.translate('after_tax_total_return')}</strong></span>
                                <span class="detail-value"><strong>${window.calculator.formatCurrency(summary.totalAfterTaxReturn)}</strong></span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('return_multiple')}</span>
                                <span class="detail-value">${((summary.totalAfterTaxReturn + summary.totalInitialInvestment) / summary.totalInitialInvestment).toFixed(2)}x</span>
                            </div>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

function openIrrModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const capitalGains = window.calculator.calculateCapitalGains(inputs);
    const summary = window.calculator.calculateSummary(inputs, yearlyAnalysis, capitalGains);
    
    const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
    
    // 构建现金流数组用于详细分析
    const cashFlows = [-summary.totalInitialInvestment];
    yearlyAnalysis.forEach((year, index) => {
        if (index === yearlyAnalysis.length - 1) {
            // 最后一年：年度现金流 + (出售收入 - 贷款剩余金额 - CGT)
            const remainingLoan = window.calculator.calculateRemainingLoan(inputs, inputs.holdingPeriod);
            const netSaleProceeds = capitalGains.futureValue - remainingLoan - capitalGains.cgtTax;
            cashFlows.push(year.netCashFlow + netSaleProceeds);
        } else {
            // 其他年份：只有正常现金流
            cashFlows.push(year.netCashFlow);
        }
    });
    
    // 计算累计现金流
    let cumulativeCashFlow = 0;
    const cumulativeFlows = cashFlows.map(flow => {
        cumulativeCashFlow += flow;
        return cumulativeCashFlow;
    });
    
    // 计算简单回报率用于对比
    const totalCashIn = summary.totalRentalIncome + capitalGains.netCapitalGain;
    const simpleReturn = ((totalCashIn - summary.totalInitialInvestment) / summary.totalInitialInvestment) / inputs.holdingPeriod;
    
    // 分析IRR为负的原因
    const isNegative = summary.irr < 0;
    const breakEvenAnalysis = window.calculator.calculateBreakEvenScenarios(inputs, yearlyAnalysis, capitalGains);
    
    const config = {
        title: window.languageManager.translate('irr_detailed_analysis'),
        summaryTitle: window.languageManager.translate('irr'),
        summaryAmount: `${(summary.irr * 100).toFixed(2)}%`,
        summaryDetails: `
            <span>${window.languageManager.translate('investment_term')}: <strong>${inputs.holdingPeriod} ${window.languageManager.translate('years')}</strong></span>
            <span>${window.languageManager.translate('irr_status')}: <strong>${isNegative ? window.languageManager.translate('negative_loss') : window.languageManager.translate('positive_profit')}</strong></span>
        `,
        tabs: [
            {
                id: 'irrCalculation',
                name: window.languageManager.translate('irr_calculation_principle'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('irr_calculation_principle_detailed')}</h5>
                        
                        <div class="explanation-section">
                            <h6>${window.languageManager.translate('what_is_irr')}</h6>
                            <p>${window.languageManager.translate('irr_definition')}</p>
                            
                            <div class="calculation-formula">
                                <h6>${window.languageManager.translate('irr_calculation_formula')}</h6>
                                <p><strong>${window.languageManager.translate('irr_formula')}</strong></p>
                                <small>${window.languageManager.translate('irr_formula_note')}</small>
                            </div>
                        </div>
                        
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${window.languageManager.translate('irr_vs_simple_return')}</h6>
                                <div class="category-amount">${(summary.irr * 100).toFixed(2)}%</div>
                                <div class="category-percentage">vs ${(simpleReturn * 100).toFixed(2)}%</div>
                                <small>${window.languageManager.translate('irr_considers_time_value')}</small>
                            </div>
                            <div class="category-card">
                                <h6>${window.languageManager.translate('calculation_method')}</h6>
                                <div class="category-amount">${window.languageManager.translate('newton_method')}</div>
                                <div class="category-percentage">${window.languageManager.translate('iterative_solution')}</div>
                                <small>${window.languageManager.translate('numerical_method')}</small>
                            </div>
                        </div>
                        
                        <div class="calculation-summary">
                            <h6>${window.languageManager.translate('irr_calculation_steps')}</h6>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('collect_cash_flows')}</span>
                                <span class="detail-value">${window.languageManager.translate('initial_plus_annual_plus_final')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('set_npv_equation')}</span>
                                <span class="detail-value">${window.languageManager.translate('npv_equals_zero')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${window.languageManager.translate('iterate_solve_irr')}</span>
                                <span class="detail-value">${window.languageManager.translate('numerical_method_find_rate')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">4. Verify Results</span>
                                <span class="detail-value">Ensure calculation converges and is reasonable</span>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'irrBreakdown',
                name: window.languageManager.translate('cash_flow_analysis'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('detailed_cash_flow_analysis')}</h5>
                        
                        <div class="cash-flow-explanation">
                            <h6>${window.languageManager.translate('cash_flow_composition_explanation')}</h6>
                            <div class="explanation-grid">
                                <div class="explanation-item">
                                    <strong>${window.languageManager.translate('year_0')}</strong> ${window.languageManager.translate('initial_investment_down_payment_costs')}
                                </div>
                                <div class="explanation-item">
                                    <strong>${window.languageManager.translate('years_1_to_n').replace('{n}', inputs.holdingPeriod-1)}</strong> ${window.languageManager.translate('annual_net_cash_flow_description')}
                                </div>
                                <div class="explanation-item">
                                    <strong>${window.languageManager.translate('year_final').replace('{n}', inputs.holdingPeriod)}</strong> ${window.languageManager.translate('annual_plus_sale_proceeds')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="cash-flow-table">
                            <div class="table-header">
                                <span>${window.languageManager.translate('year')}</span>
                                <span>${window.languageManager.translate('cash_flow_composition')}</span>
                                <span>${window.languageManager.translate('cash_flow_amount')}</span>
                                <span>${window.languageManager.translate('present_value').replace('{irr}', (summary.irr * 100).toFixed(2))}</span>
                            </div>
                            ${cashFlows.map((flow, index) => {
                                const presentValue = flow / Math.pow(1 + summary.irr, index);
                                let flowDescription = '';
                                
                                if (index === 0) {
                                    flowDescription = window.languageManager.translate('initial_investment');
                                } else if (index === cashFlows.length - 1) {
                                    const normalFlow = yearlyAnalysis[index - 1].netCashFlow;
                                    const remainingLoan = window.calculator.calculateRemainingLoan(inputs, inputs.holdingPeriod);
                                    const netSaleProceeds = capitalGains.futureValue - remainingLoan - capitalGains.cgtTax;
                                    flowDescription = `${window.languageManager.translate('annual_plus_sale_net_proceeds')}<br><small>${window.languageManager.translate('annual')}: ${window.calculator.formatCurrency(normalFlow)}<br>${window.languageManager.translate('sale')}: ${window.calculator.formatCurrency(capitalGains.futureValue)} - ${window.calculator.formatCurrency(remainingLoan)} - ${window.calculator.formatCurrency(capitalGains.cgtTax)} = ${window.calculator.formatCurrency(netSaleProceeds)}</small>`;
                                } else {
                                    flowDescription = window.languageManager.translate('annual_net_cash_flow');
                                }
                                
                                return `
                                    <div class="table-row ${flow < 0 ? 'negative' : 'positive'}">
                                        <span>${window.languageManager.translate('year')} ${index}</span>
                                        <span>${flowDescription}</span>
                                        <span>${window.calculator.formatCurrency(flow)}</span>
                                        <span>${window.calculator.formatCurrency(presentValue)}</span>
                                    </div>
                                `;
                            }).join('')}
                            <div class="table-footer">
                                <span><strong>${window.languageManager.translate('npv_total')}</strong></span>
                                <span><strong>${window.languageManager.translate('sum_of_all_present_values')}</strong></span>
                                <span><strong>${window.calculator.formatCurrency(cumulativeFlows[cumulativeFlows.length - 1])}</strong></span>
                                <span><strong>≈ $0</strong></span>
                            </div>
                        </div>
                        
                        <div class="calculation-verification">
                            <h6>${window.languageManager.translate('calculation_verification')}</h6>
                            <p><strong>${window.languageManager.translate('irr_definition')}:</strong> ${window.languageManager.translate('irr_npv_zero_rate')}</p>
                            <p><strong>${window.languageManager.translate('verification_result')}:</strong> ${window.languageManager.translate('all_cash_flows_discounted_sum').replace('{irr}', (summary.irr * 100).toFixed(2))}</p>
                            <p><strong>${window.languageManager.translate('calculation_accuracy')}:</strong> ${Math.abs(cashFlows.reduce((sum, flow, index) => sum + flow / Math.pow(1 + summary.irr, index), 0)) < 1000 ? '✅ ' + window.languageManager.translate('calculation_correct') : '⚠️ ' + window.languageManager.translate('needs_review')}</p>
                        </div>
                        
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${t('cash_flow_characteristics')}</h6>
                                <div class="category-amount">${cashFlows.filter(f => f > 0).length}</div>
                                <div class="category-percentage">${t('positive_cash_flow_years')}</div>
                                <small>${t('total_investment_period').replace('{years}', cashFlows.length - 1)}</small>
                            </div>
                            <div class="category-card">
                                <h6>${t('payback_period')}</h6>
                                <div class="category-amount">${cumulativeFlows.findIndex(cf => cf > 0) > 0 ? cumulativeFlows.findIndex(cf => cf > 0) : t('not_recovered')}</div>
                                <div class="category-percentage">${cumulativeFlows.findIndex(cf => cf > 0) > 0 ? t('years') : ''}</div>
                                <small>${t('cumulative_cash_flow_positive_time')}</small>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'irrBenchmark',
                name: window.languageManager.translate('irr_benchmark_comparison'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('irr_benchmark_comparison')}</h5>
                        
                        <div class="explanation-section">
                            <h6>${window.languageManager.translate('irr_definition_verification')}</h6>
                            <p>${window.languageManager.translate('current_npv_result')}</p>
                        </div>
                        
                        <div class="benchmark-comparison-grid">
                            <div class="current-irr-display">
                                <h6>${window.languageManager.translate('current_irr_result')}</h6>
                                <div class="irr-value ${summary.irr > 0 ? 'positive' : 'negative'}">${(summary.irr * 100).toFixed(2)}%</div>
                                <p>${window.languageManager.translate('irr_performance_evaluation')}</p>
                            </div>
                            
                            <div class="benchmark-grid">
                                <div class="benchmark-item ${summary.irr > 0.12 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('excellent_investment')}</span>
                                    <span class="benchmark-value">>12%</span>
                                    <span class="benchmark-description">${window.languageManager.translate('excellent_investment_desc')}</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0.08 && summary.irr <= 0.12 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('good_investment')}</span>
                                    <span class="benchmark-value">8-12%</span>
                                    <span class="benchmark-description">${window.languageManager.translate('good_investment_desc')}</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0.05 && summary.irr <= 0.08 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('average_investment')}</span>
                                    <span class="benchmark-value">5-8%</span>
                                    <span class="benchmark-description">${window.languageManager.translate('average_investment_desc')}</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0 && summary.irr <= 0.05 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('low_return')}</span>
                                    <span class="benchmark-value">0-5%</span>
                                    <span class="benchmark-description">${window.languageManager.translate('low_return_desc')}</span>
                                </div>
                                <div class="benchmark-item ${summary.irr <= 0 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('investment_loss')}</span>
                                    <span class="benchmark-value"><0%</span>
                                    <span class="benchmark-description">${window.languageManager.translate('investment_loss_desc')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="market-comparison">
                            <h6>${window.languageManager.translate('market_benchmark_comparison')}</h6>
                            <div class="market-rates">
                                <div class="rate-item">
                                    <span class="rate-label">${window.languageManager.translate('market_interest_rate')}</span>
                                    <span class="rate-value">4.5-5.5%</span>
                                    <span class="rate-comparison ${summary.irr > 0.055 ? 'better' : 'worse'}">${summary.irr > 0.055 ? '✅' : '❌'}</span>
                                </div>
                                <div class="rate-item">
                                    <span class="rate-label">${window.languageManager.translate('investment_property_loan_rate')}</span>
                                    <span class="rate-value">6-7%</span>
                                    <span class="rate-comparison ${summary.irr > 0.07 ? 'better' : 'worse'}">${summary.irr > 0.07 ? '✅' : '❌'}</span>
                                </div>
                                <div class="rate-item">
                                    <span class="rate-label">${window.languageManager.translate('stock_market_average_return')}</span>
                                    <span class="rate-value">8-10%</span>
                                    <span class="rate-comparison ${summary.irr > 0.10 ? 'better' : 'worse'}">${summary.irr > 0.10 ? '✅' : '❌'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="investment-recommendation">
                            <h6>${window.languageManager.translate('investment_recommendation')}</h6>
                            ${summary.irr > 0.12 ? `
                                <div class="recommendation excellent">
                                    <p><strong>${window.languageManager.translate('excellent_investment_recommendation')}</strong></p>
                                </div>
                            ` : summary.irr > 0.08 ? `
                                <div class="recommendation good">
                                    <p><strong>${window.languageManager.translate('good_investment_recommendation')}</strong></p>
                                </div>
                            ` : summary.irr > 0.05 ? `
                                <div class="recommendation average">
                                    <p><strong>${window.languageManager.translate('average_investment_recommendation')}</strong></p>
                                </div>
                            ` : summary.irr > 0 ? `
                                <div class="recommendation low">
                                    <p><strong>${window.languageManager.translate('low_return_recommendation')}</strong></p>
                                </div>
                            ` : `
                                <div class="recommendation loss">
                                    <p><strong>${window.languageManager.translate('investment_loss_recommendation')}</strong></p>
                                </div>
                            `}
                        </div>
                    </div>
                `
            },
            {
                id: 'irrAnalysis',
                name: window.languageManager.translate('irr_optimization'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${window.languageManager.translate('irr_result_deep_analysis')}</h5>
                        
                        ${isNegative ? `
                            <div class="alert-section negative-irr">
                                <h6>${window.languageManager.translate('negative_irr_reason_analysis')}</h6>
                                <p>${window.languageManager.translate('negative_irr_explanation').replace('{irr}', (summary.irr * 100).toFixed(2))}</p>
                                
                                <div class="reason-analysis">
                                    <div class="reason-item">
                                        <h6>${window.languageManager.translate('cash_flow_insufficient')}</h6>
                                        <p>${t('annual_net_cash_flow').replace('{status}', yearlyAnalysis.every(y => y.netCashFlow < 0) ? t('all_negative') : t('partially_negative'))}</p>
                                        <p>${window.languageManager.translate('rental_cannot_cover_expenses')}</p>
                                    </div>
                                    
                                    <div class="reason-item">
                                        <h6>${window.languageManager.translate('capital_growth_insufficient')}</h6>
                                        <p>${window.languageManager.translate('expected_capital_growth').replace('{amount}', window.calculator.formatCurrency(capitalGains.capitalGain))}</p>
                                        <p>${window.languageManager.translate('capital_growth_cannot_offset')}</p>
                                    </div>
                                    
                                    <div class="reason-item">
                                        <h6>${window.languageManager.translate('high_tax_costs')}</h6>
                                        <p>${window.languageManager.translate('expected_cgt').replace('{amount}', window.calculator.formatCurrency(capitalGains.cgtTax))}</p>
                                        <p>${window.languageManager.translate('cgt_reduces_final_return')}</p>
                                    </div>
                                </div>
                                
                                <div class="improvement-suggestions">
                                    <h6>${window.languageManager.translate('improvement_suggestions')}</h6>
                                    <ul>
                                        <li><strong>${window.languageManager.translate('increase_rent')}</strong></li>
                                        <li><strong>${window.languageManager.translate('reduce_expenses')}</strong></li>
                                        <li><strong>${window.languageManager.translate('adjust_loan')}</strong></li>
                                        <li><strong>${window.languageManager.translate('reassess_growth').replace('{rate}', inputs.capitalGrowthRate)}</strong></li>
                                    </ul>
                                </div>
                            </div>
                        ` : `
                            <div class="alert-section positive-irr">
                                <h6>${window.languageManager.translate('positive_irr_performance')}</h6>
                                <p>${window.languageManager.translate('positive_irr_explanation').replace('{irr}', (summary.irr * 100).toFixed(2))}</p>
                            </div>
                        `}
                        
                        <div class="comparison-analysis">
                            <h6>${window.languageManager.translate('irr_benchmark_comparison')}</h6>
                            <div class="benchmark-grid">
                                <div class="benchmark-item ${summary.irr > 0.12 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('excellent_investment')}</span>
                                    <span class="benchmark-value">>12%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0.08 && summary.irr <= 0.12 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('good_investment')}</span>
                                    <span class="benchmark-value">8-12%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0.05 && summary.irr <= 0.08 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('average_investment')}</span>
                                    <span class="benchmark-value">5-8%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0 && summary.irr <= 0.05 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('low_return')}</span>
                                    <span class="benchmark-value">0-5%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr <= 0 ? 'current' : ''}">
                                    <span class="benchmark-label">${window.languageManager.translate('investment_loss')}</span>
                                    <span class="benchmark-value"><0%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sensitivity-analysis">
                            <h6>${window.languageManager.translate('sensitivity_analysis')}</h6>
                            <p>${window.languageManager.translate('irr_parameter_sensitivity')}:</p>
                            <div class="sensitivity-grid">
                                <div class="sensitivity-item">
                                    <span>${window.languageManager.translate('rent_increase_10')}</span>
                                    <span class="positive">${window.languageManager.translate('irr_improvement_1_2')}</span>
                                </div>
                                <div class="sensitivity-item">
                                    <span>${window.languageManager.translate('interest_rate_decrease_1')}</span>
                                    <span class="positive">${window.languageManager.translate('irr_improvement_1_3')}</span>
                                </div>
                                <div class="sensitivity-item">
                                    <span>${window.languageManager.translate('growth_rate_increase_1')}</span>
                                    <span class="positive">${window.languageManager.translate('irr_improvement_0_5_1')}</span>
                                </div>
                                <div class="sensitivity-item">
                                    <span>${window.languageManager.translate('purchase_price_decrease_5')}</span>
                                    <span class="positive">${window.languageManager.translate('irr_improvement_1_2')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

function openTotalDeductionsModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const summary = window.calculator.calculateSummary(inputs, yearlyAnalysis, {});
    
    // 计算各项费用的累计金额
    let totalInterest = 0;
    let totalOperating = 0;
    let totalDeductions = 0;
    
    yearlyAnalysis.forEach(year => {
        const loanPayments = window.calculator.calculateLoanPayments(inputs.loanAmount, inputs.interestRate, inputs.loanTerm, inputs.repaymentType);
        const annualInterest = loanPayments.monthlyInterest * 12;
        const managementFeesAmount = year.rentalIncome * (inputs.managementFees / 100);
        const operatingExpenses = inputs.strataFees + inputs.councilRates + inputs.waterRates + 
                                inputs.insurance + inputs.maintenance + managementFeesAmount;
        
        totalInterest += annualInterest;
        totalOperating += operatingExpenses;
        totalDeductions += year.totalDeductions;
    });
    
    const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
    
    const config = {
        title: t('total_deductions_detailed_analysis'),
        summaryTitle: t('total_deductions'),
        summaryAmount: window.calculator.formatCurrency(totalDeductions),
        summaryDetails: `
            <span>${t('investment_period')}: <strong>${inputs.holdingPeriod}${t('years')}</strong></span>
            <span>${t('average_annual_deduction')}: <strong>${window.calculator.formatCurrency(totalDeductions / inputs.holdingPeriod)}</strong></span>
        `,
        tabs: [
            {
                id: 'deductionsBreakdown',
                name: t('expense_breakdown'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('total_deductions')} ${t('expense_breakdown')} (${inputs.holdingPeriod}${t('years')})</h5>
                        
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${t('loan_interest')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(totalInterest)}</div>
                                <div class="category-percentage">${((totalInterest / totalDeductions) * 100).toFixed(1)}%</div>
                                <small>${t('investment_property_loan_interest')}</small>
                            </div>
                            
                            <div class="category-card">
                                <h6>${t('operating_expenses')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(totalOperating)}</div>
                                <div class="category-percentage">${((totalOperating / totalDeductions) * 100).toFixed(1)}%</div>
                                <small>${t('property_fees_council_insurance')}</small>
                            </div>
                        </div>
                        
                        <div class="breakdown-details">
                            <h6>${t('operating_expenses')} ${t('expense_breakdown')}</h6>
                            <div class="detail-breakdown">
                                <div class="breakdown-item">
                                    <span>${t('strata_fees')}</span>
                                    <span>${window.calculator.formatCurrency(inputs.strataFees * inputs.holdingPeriod)}</span>
                                </div>
                                <div class="breakdown-item">
                                    <span>${t('council_rates')}</span>
                                    <span>${window.calculator.formatCurrency(inputs.councilRates * inputs.holdingPeriod)}</span>
                                </div>
                                <div class="breakdown-item">
                                    <span>${t('water_rates')}</span>
                                    <span>${window.calculator.formatCurrency(inputs.waterRates * inputs.holdingPeriod)}</span>
                                </div>
                                <div class="breakdown-item">
                                    <span>${t('insurance')}</span>
                                    <span>${window.calculator.formatCurrency(inputs.insurance * inputs.holdingPeriod)}</span>
                                </div>
                                <div class="breakdown-item">
                                    <span>${t('maintenance')}</span>
                                    <span>${window.calculator.formatCurrency(inputs.maintenance * inputs.holdingPeriod)}</span>
                                </div>
                                <div class="breakdown-item">
                                    <span>${t('management_fees')}</span>
                                    <span>${window.calculator.formatCurrency(yearlyAnalysis.reduce((sum, year) => sum + (year.rentalIncome * inputs.managementFees / 100), 0))}</span>
                                </div>
                                <div class="breakdown-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                    <span><strong>${t('total_deductions')}</strong></span>
                                    <span><strong>${window.calculator.formatCurrency(totalDeductions)}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'deductionsYearly',
                name: t('annual_breakdown'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('annual_breakdown')} - ${t('total_deductions')}</h5>
                        ${yearlyAnalysis.map(year => {
                            const loanPayments = window.calculator.calculateLoanPayments(inputs.loanAmount, inputs.interestRate, inputs.loanTerm, inputs.repaymentType);
                            const annualInterest = loanPayments.monthlyInterest * 12;
                            const managementFeesAmount = year.rentalIncome * (inputs.managementFees / 100);
                            
                            return `
                                <div class="year-detail-card">
                                    <div class="year-header">
                                        <span class="year-title">${t('year')} ${year.year}</span>
                                        <span class="year-benefit-amount positive">${window.calculator.formatCurrency(year.totalDeductions)}</span>
                                    </div>
                                    <div class="year-details">
                                        <div class="detail-grid">
                                            <div class="detail-section">
                                                <h6>${t('loan_interest')}</h6>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('loan_interest')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(annualInterest)}</span>
                                                </div>
                                            </div>
                                            <div class="detail-section">
                                                <h6>${t('operating_expenses')}</h6>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('strata_fees')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(inputs.strataFees)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('council_rates')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(inputs.councilRates)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('water_rates')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(inputs.waterRates)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('insurance')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(inputs.insurance)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('maintenance')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(inputs.maintenance)}</span>
                                                </div>
                                                <div class="detail-item">
                                                    <span class="detail-label">${t('management_fees')}</span>
                                                    <span class="detail-value">${window.calculator.formatCurrency(managementFeesAmount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="calculation-summary">
                                            <div class="detail-item">
                                                <span class="detail-label"><strong>${t('total_deductions')} (${t('annual_rent')})</strong></span>
                                                <span class="detail-value"><strong>${window.calculator.formatCurrency(year.totalDeductions)}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `
            },
            {
                id: 'deductionsTips',
                name: t('deduction_optimization'),
                content: `
                    <div class="tax-explanation-detailed">
                        <h5>${t('deductible_expenses_optimization_suggestions')}</h5>
                        
                        <div class="explanation-section">
                            <h6>1. ${t('main_deductible_expense_categories')}</h6>
                            <ul>
                                <li><strong>${t('loan_interest')}:</strong> ${t('loan_interest_desc')}</li>
                                <li><strong>${t('property_management_fees')}:</strong> ${t('property_management_fees_desc')}</li>
                                <li><strong>${t('council_fees')}:</strong> ${t('council_fees_desc')}</li>
                                <li><strong>${t('insurance_costs')}:</strong> ${t('insurance_costs_desc')}</li>
                                <li><strong>${t('maintenance_costs')}:</strong> ${t('maintenance_costs_desc')}</li>
                                <li><strong>${t('agent_fees')}:</strong> ${t('agent_fees_desc')}</li>
                            </ul>
                        </div>
                        
                        <div class="explanation-section">
                            <h6>2. ${t('deduction_optimization_strategies')}</h6>
                            <ul>
                                <li><strong>${t('record_keeping')}:</strong> ${t('record_keeping_desc')}</li>
                                <li><strong>${t('professional_consultation')}:</strong> ${t('professional_consultation_desc')}</li>
                                <li><strong>${t('expense_classification')}:</strong> ${t('expense_classification_desc')}</li>
                                <li><strong>${t('timing_planning')}:</strong> ${t('timing_planning_desc')}</li>
                            </ul>
                        </div>
                        
                        <div class="explanation-section">
                            <h6>3. ${t('important_notes')}</h6>
                            <ul>
                                <li><strong>${t('capital_expenditure')}:</strong> ${t('capital_expenditure_desc')}</li>
                                <li><strong>${t('personal_use')}:</strong> ${t('personal_use_desc')}</li>
                                <li><strong>${t('ato_regulations')}:</strong> ${t('ato_regulations_desc')}</li>
                                <li><strong>${t('professional_advice')}:</strong> ${t('professional_advice_desc')}</li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

function openCgtModal() {
    const inputs = window.calculator.currentInputs;
    const capitalGains = window.calculator.calculateCapitalGains(inputs);
    const marginalTaxRate = window.calculator.calculateMarginalTaxRate(inputs.personalIncome);
    
    const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
    
    const config = {
        title: t('cgt_detailed_analysis'),
        summaryTitle: t('expected_cgt'),
        summaryAmount: window.calculator.formatCurrency(capitalGains.cgtTax),
        summaryDetails: `
            <span>${t('capital_gain')}: <strong>${window.calculator.formatCurrency(capitalGains.capitalGain)}</strong></span>
            <span>${t('cgt_discount')}: <strong>${capitalGains.cgtDiscount ? '50%' : t('none')}</strong></span>
        `,
        tabs: [
            {
                id: 'cgtBreakdown',
                name: t('cgt_calculation'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('cgt_calculation_process')}</h5>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">${t('sale_price')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(capitalGains.futureValue)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('minus_purchase_price')}</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(inputs.purchasePrice)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('minus_purchase_costs')}</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(inputs.purchaseCosts)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('capital_gain')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(capitalGains.capitalGain)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('cgt_discount')} (${capitalGains.cgtDiscount ? '50%' : '0%'})</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(capitalGains.capitalGain - capitalGains.taxableCapitalGain)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('taxable_capital_gain')}</span>
                                <span class="detail-value">${window.calculator.formatCurrency(capitalGains.taxableCapitalGain)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">${t('marginal_tax_rate')}</span>
                                <span class="detail-value">${(marginalTaxRate * 100).toFixed(1)}%</span>
                            </div>
                            <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                <span class="detail-label"><strong>${t('cgt_payable')}</strong></span>
                                <span class="detail-value"><strong>${window.calculator.formatCurrency(capitalGains.cgtTax)}</strong></span>
                            </div>
                        </div>
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>${t('cgt_discount')}</h6>
                                <div class="category-amount">${capitalGains.cgtDiscount ? '50%' : '0%'}</div>
                                <div class="category-percentage">${inputs.holdingPeriod > 1 ? t('applicable') : t('not_applicable')}</div>
                                <small>${t('holding_over_12_months')}</small>
                            </div>
                            <div class="category-card">
                                <h6>${t('tax_savings_amount')}</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(capitalGains.capitalGain - capitalGains.taxableCapitalGain)}</div>
                                <div class="category-percentage">${t('cgt_discount')}</div>
                                <small>${t('compared_to_no_discount')}</small>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'cgtStrategy',
                name: t('cgt_optimization_strategy'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('cgt_optimization_strategy')}</h5>
                        
                        <div class="explanation-section">
                            <h6>${t('cgt_discount_benefit')}</h6>
                            <p>${t('holding_over_12_months')}</p>
                            ${inputs.holdingPeriod > 1 ? `
                                <div class="alert-section positive">
                                    <p><strong>✅ ${t('cgt_discount_applicable')}</strong></p>
                                    <p>${t('cgt_discount_benefit_description').replace('{amount}', window.calculator.formatCurrency(capitalGains.capitalGain - capitalGains.taxableCapitalGain))}</p>
                                </div>
                            ` : `
                                <div class="alert-section warning">
                                    <p><strong>⚠️ ${t('cgt_discount_not_applicable')}</strong></p>
                                    <p>${t('short_term_holding_warning').replace('{years}', inputs.holdingPeriod)}</p>
                                </div>
                            `}
                        </div>
                        
                        <div class="explanation-section">
                            <h6>${t('cgt_timing_strategies')}</h6>
                            <ul>
                                <li><strong>${t('hold_over_12_months')}:</strong> ${t('qualify_for_50_percent_discount')}</li>
                                <li><strong>${t('income_timing')}:</strong> ${t('sell_in_lower_income_year')}</li>
                                <li><strong>${t('capital_losses')}:</strong> ${t('offset_with_capital_losses')}</li>
                                <li><strong>${t('installment_sales')}:</strong> ${t('spread_capital_gains_over_years')}</li>
                            </ul>
                        </div>
                        
                        <div class="explanation-section">
                            <h6>${t('cgt_impact_analysis')}</h6>
                            <div class="impact-comparison">
                                <div class="impact-item">
                                    <span class="impact-label">${t('without_cgt_discount')}</span>
                                    <span class="impact-value">${window.calculator.formatCurrency(capitalGains.capitalGain * marginalTaxRate)}</span>
                                </div>
                                <div class="impact-item current">
                                    <span class="impact-label">${t('with_cgt_discount')}</span>
                                    <span class="impact-value">${window.calculator.formatCurrency(capitalGains.cgtTax)}</span>
                                </div>
                                <div class="impact-item savings">
                                    <span class="impact-label">${t('tax_savings')}</span>
                                    <span class="impact-value">${window.calculator.formatCurrency((capitalGains.capitalGain * marginalTaxRate) - capitalGains.cgtTax)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'cgtScenarios',
                name: t('cgt_scenarios_analysis'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('cgt_scenarios_analysis')}</h5>
                        
                        <div class="scenario-analysis">
                            <h6>${t('different_holding_periods')}</h6>
                            <div class="scenarios-grid">
                                ${[1, 2, 3, 5, 7, 10].map(years => {
                                    const scenarioCapitalGains = window.calculator.calculateCapitalGains({
                                        ...inputs,
                                        holdingPeriod: years
                                    });
                                    const hasDiscount = years > 1;
                                    const scenarioCgt = hasDiscount ? 
                                        scenarioCapitalGains.taxableCapitalGain * marginalTaxRate :
                                        scenarioCapitalGains.capitalGain * marginalTaxRate;
                                    
                                    return `
                                        <div class="scenario-item ${years === inputs.holdingPeriod ? 'current' : ''}" ${years === inputs.holdingPeriod ? `data-current-label="${t('current')}"` : ''}>
                                            <div class="scenario-period">${years} ${t('years')}</div>
                                            <div class="scenario-discount">${hasDiscount ? '50%' : '0%'} ${t('discount')}</div>
                                            <div class="scenario-cgt">${window.calculator.formatCurrency(scenarioCgt)}</div>
                                            <div class="scenario-savings">${hasDiscount ? window.calculator.formatCurrency(scenarioCapitalGains.capitalGain * marginalTaxRate * 0.5) : '$0'}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div class="scenario-analysis">
                            <h6>${t('different_income_levels')}</h6>
                            <div class="income-scenarios">
                                ${[50000, 80000, 120000, 180000, 250000].map(income => {
                                    const scenarioTaxRate = window.calculator.calculateMarginalTaxRate(income);
                                    const scenarioCgt = capitalGains.taxableCapitalGain * scenarioTaxRate;
                                    
                                    return `
                                        <div class="income-scenario ${income === inputs.personalIncome ? 'current' : ''}" ${income === inputs.personalIncome ? `data-current-label="${t('current')}"` : ''}>
                                            <span class="income-label">${window.calculator.formatCurrency(income)}</span>
                                            <span class="tax-rate">${(scenarioTaxRate * 100).toFixed(1)}%</span>
                                            <span class="cgt-amount">${window.calculator.formatCurrency(scenarioCgt)}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    const taxModal = document.getElementById('taxBenefitsModal');
    const detailModal = document.getElementById('detailModal');
    
    if (event.target === taxModal) {
        closeTaxBenefitsModal();
    }
    if (event.target === detailModal) {
        closeDetailModal();
    }
});

// 敏感性分析模态框
function openSensitivityModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const capitalGains = window.calculator.calculateCapitalGains(inputs);
    const summary = window.calculator.calculateSummary(inputs, yearlyAnalysis, capitalGains);
    
    const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
    
    // 计算不同参数变化对IRR的影响
    const sensitivityScenarios = [
        { param: 'rent', change: 0.1, label: t('rent_increase_10') },
        { param: 'rent', change: -0.1, label: t('rent_decrease_10') },
        { param: 'interestRate', change: -0.01, label: t('interest_rate_decrease_1') },
        { param: 'interestRate', change: 0.01, label: t('interest_rate_increase_1') },
        { param: 'capitalGrowthRate', change: 0.01, label: t('growth_rate_increase_1') },
        { param: 'capitalGrowthRate', change: -0.01, label: t('growth_rate_decrease_1') },
        { param: 'purchasePrice', change: -0.05, label: t('purchase_price_decrease_5') },
        { param: 'purchasePrice', change: 0.05, label: t('purchase_price_increase_5') }
    ];
    
    const config = {
        title: t('sensitivity_analysis_detailed'),
        summaryTitle: t('sensitivity_analysis'),
        summaryAmount: `${t('base_irr')}: ${(summary.irr * 100).toFixed(2)}%`,
        summaryDetails: `
            <span>${t('current_scenario')}: <strong>${t('base_case_analysis')}</strong></span>
            <span>${t('parameter_variations')}: <strong>${t('plus_minus_scenarios')}</strong></span>
        `,
        tabs: [
            {
                id: 'sensitivityIRR',
                name: t('irr_sensitivity'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('irr_sensitivity_analysis')}</h5>
                        
                        <div class="sensitivity-table">
                            <div class="table-header">
                                <span>${t('parameter_change')}</span>
                                <span>${t('new_irr')}</span>
                                <span>${t('irr_change')}</span>
                                <span>${t('impact_level')}</span>
                            </div>
                            ${sensitivityScenarios.map(scenario => {
                                let modifiedInputs = {...inputs};
                                
                                if (scenario.param === 'rent') {
                                    modifiedInputs.weeklyRent = inputs.weeklyRent * (1 + scenario.change);
                                } else if (scenario.param === 'interestRate') {
                                    modifiedInputs.interestRate = inputs.interestRate + scenario.change;
                                } else if (scenario.param === 'capitalGrowthRate') {
                                    modifiedInputs.capitalGrowthRate = inputs.capitalGrowthRate + scenario.change;
                                } else if (scenario.param === 'purchasePrice') {
                                    modifiedInputs.purchasePrice = inputs.purchasePrice * (1 + scenario.change);
                                    modifiedInputs.loanAmount = modifiedInputs.purchasePrice * (inputs.loanAmount / inputs.purchasePrice);
                                }
                                
                                const modifiedYearlyAnalysis = window.calculator.calculateYearlyAnalysis(modifiedInputs);
                                const modifiedCapitalGains = window.calculator.calculateCapitalGains(modifiedInputs);
                                const modifiedSummary = window.calculator.calculateSummary(modifiedInputs, modifiedYearlyAnalysis, modifiedCapitalGains);
                                
                                const irrChange = modifiedSummary.irr - summary.irr;
                                const impactLevel = Math.abs(irrChange) > 0.02 ? t('high_impact') : 
                                                  Math.abs(irrChange) > 0.01 ? t('medium_impact') : t('low_impact');
                                
                                return `
                                    <div class="table-row ${irrChange > 0 ? 'positive' : 'negative'}">
                                        <span>${scenario.label}</span>
                                        <span>${(modifiedSummary.irr * 100).toFixed(2)}%</span>
                                        <span>${irrChange > 0 ? '+' : ''}${(irrChange * 100).toFixed(2)}%</span>
                                        <span class="impact-${Math.abs(irrChange) > 0.02 ? 'high' : Math.abs(irrChange) > 0.01 ? 'medium' : 'low'}">${impactLevel}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <div class="sensitivity-insights">
                            <h6>${t('key_insights')}</h6>
                            <ul>
                                <li><strong>${t('most_sensitive_parameter')}:</strong> ${t('rental_income_changes')}</li>
                                <li><strong>${t('interest_rate_impact')}:</strong> ${t('significant_irr_effect')}</li>
                                <li><strong>${t('capital_growth_sensitivity')}:</strong> ${t('moderate_long_term_impact')}</li>
                                <li><strong>${t('purchase_price_effect')}:</strong> ${t('initial_investment_leverage')}</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            {
                id: 'sensitivityCashFlow',
                name: t('cash_flow_sensitivity'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('cash_flow_sensitivity_analysis')}</h5>
                        
                        <div class="scenario-comparison">
                            <h6>${t('annual_cash_flow_scenarios')}</h6>
                            <div class="scenarios-grid">
                                ${[0.9, 0.95, 1.0, 1.05, 1.1].map(multiplier => {
                                    const modifiedInputs = {...inputs, weeklyRent: inputs.weeklyRent * multiplier};
                                    const modifiedYearlyAnalysis = window.calculator.calculateYearlyAnalysis(modifiedInputs);
                                    const avgCashFlow = modifiedYearlyAnalysis.reduce((sum, year) => sum + year.netCashFlow, 0) / modifiedYearlyAnalysis.length;
                                    
                                    return `
                                        <div class="scenario-item ${multiplier === 1.0 ? 'current' : ''}">
                                            <div class="scenario-label">${t('rent')} ${multiplier === 1.0 ? t('current') : (multiplier > 1.0 ? '+' : '') + ((multiplier - 1) * 100).toFixed(0) + '%'}</div>
                                            <div class="scenario-value ${avgCashFlow > 0 ? 'positive' : 'negative'}">${window.calculator.formatCurrency(avgCashFlow)}</div>
                                            <div class="scenario-description">${t('annual_average')}</div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div class="break-even-analysis">
                            <h6>${t('break_even_analysis')}</h6>
                            <p>${t('break_even_explanation')}</p>
                            <div class="break-even-scenarios">
                                <div class="break-even-item">
                                    <span class="break-even-label">${t('break_even_rent')}</span>
                                    <span class="break-even-value">${window.calculator.formatCurrency(inputs.weeklyRent * 1.2)}/week</span>
                                </div>
                                <div class="break-even-item">
                                    <span class="break-even-label">${t('break_even_interest_rate')}</span>
                                    <span class="break-even-value">${((inputs.interestRate - 0.02) * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

// 计算验证模态框
function openVerificationModal() {
    const inputs = window.calculator.currentInputs;
    const yearlyAnalysis = window.calculator.currentYearlyAnalysis;
    const capitalGains = window.calculator.calculateCapitalGains(inputs);
    const summary = window.calculator.calculateSummary(inputs, yearlyAnalysis, capitalGains);
    
    const t = (key) => window.languageManager ? window.languageManager.translate(key) : key;
    
    // 构建现金流数组用于验证
    const cashFlows = [-summary.totalInitialInvestment];
    yearlyAnalysis.forEach((year, index) => {
        if (index === yearlyAnalysis.length - 1) {
            const remainingLoan = window.calculator.calculateRemainingLoan(inputs, inputs.holdingPeriod);
            const netSaleProceeds = capitalGains.futureValue - remainingLoan - capitalGains.cgtTax;
            cashFlows.push(year.netCashFlow + netSaleProceeds);
        } else {
            cashFlows.push(year.netCashFlow);
        }
    });
    
    // NPV验证计算
    const npvAtIRR = cashFlows.reduce((sum, flow, index) => sum + flow / Math.pow(1 + summary.irr, index), 0);
    const isAccurate = Math.abs(npvAtIRR) < 1000;
    
    const config = {
        title: t('calculation_verification_detailed'),
        summaryTitle: t('calculation_verification'),
        summaryAmount: isAccurate ? '✅ ' + t('verified') : '⚠️ ' + t('needs_review'),
        summaryDetails: `
            <span>${t('npv_at_irr')}: <strong>${window.calculator.formatCurrency(npvAtIRR)}</strong></span>
            <span>${t('accuracy_status')}: <strong>${isAccurate ? t('accurate') : t('requires_adjustment')}</strong></span>
        `,
        tabs: [
            {
                id: 'npvVerification',
                name: t('npv_verification'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('npv_calculation_verification')}</h5>
                        
                        <div class="verification-explanation">
                            <h6>${t('irr_definition_detailed')}</h6>
                            <p>${t('irr_npv_zero_explanation')}</p>
                            <p><strong>${t('formula')}:</strong> NPV = Σ [CFt / (1 + IRR)^t] = 0</p>
                        </div>
                        
                        <div class="cash-flow-verification">
                            <h6>${t('cash_flow_present_value_calculation')}</h6>
                            <div class="verification-table">
                                <div class="table-header">
                                    <span>${t('year')}</span>
                                    <span>${t('cash_flow')}</span>
                                    <span>${t('discount_factor')}</span>
                                    <span>${t('present_value')}</span>
                                </div>
                                ${cashFlows.map((flow, index) => {
                                    const discountFactor = 1 / Math.pow(1 + summary.irr, index);
                                    const presentValue = flow * discountFactor;
                                    
                                    return `
                                        <div class="table-row">
                                            <span>${index}</span>
                                            <span class="${flow < 0 ? 'negative' : 'positive'}">${window.calculator.formatCurrency(flow)}</span>
                                            <span>${discountFactor.toFixed(4)}</span>
                                            <span class="${presentValue < 0 ? 'negative' : 'positive'}">${window.calculator.formatCurrency(presentValue)}</span>
                                        </div>
                                    `;
                                }).join('')}
                                <div class="table-footer">
                                    <span><strong>${t('total_npv')}</strong></span>
                                    <span><strong>-</strong></span>
                                    <span><strong>-</strong></span>
                                    <span><strong class="${npvAtIRR < 0 ? 'negative' : 'positive'}">${window.calculator.formatCurrency(npvAtIRR)}</strong></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="verification-result">
                            <h6>${t('verification_conclusion')}</h6>
                            <div class="result-card ${isAccurate ? 'success' : 'warning'}">
                                <div class="result-icon">${isAccurate ? '✅' : '⚠️'}</div>
                                <div class="result-content">
                                    <h6>${isAccurate ? t('calculation_verified') : t('calculation_needs_review')}</h6>
                                    <p>${isAccurate ? 
                                        t('npv_close_to_zero_explanation') : 
                                        t('npv_deviation_explanation').replace('{amount}', window.calculator.formatCurrency(Math.abs(npvAtIRR)))
                                    }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'methodologyVerification',
                name: t('methodology_verification'),
                content: `
                    <div class="breakdown-summary">
                        <h5>${t('calculation_methodology_verification')}</h5>
                        
                        <div class="methodology-check">
                            <h6>${t('calculation_steps_verification')}</h6>
                            <div class="verification-checklist">
                                <div class="check-item verified">
                                    <span class="check-icon">✅</span>
                                    <span class="check-label">${t('initial_investment_calculation')}</span>
                                    <span class="check-value">${window.calculator.formatCurrency(summary.totalInitialInvestment)}</span>
                                </div>
                                <div class="check-item verified">
                                    <span class="check-icon">✅</span>
                                    <span class="check-label">${t('annual_cash_flows_calculation')}</span>
                                    <span class="check-value">${yearlyAnalysis.length} ${t('years')}</span>
                                </div>
                                <div class="check-item verified">
                                    <span class="check-icon">✅</span>
                                    <span class="check-label">${t('final_sale_proceeds_calculation')}</span>
                                    <span class="check-value">${window.calculator.formatCurrency(capitalGains.futureValue - window.calculator.calculateRemainingLoan(inputs, inputs.holdingPeriod) - capitalGains.cgtTax)}</span>
                                </div>
                                <div class="check-item ${isAccurate ? 'verified' : 'warning'}">
                                    <span class="check-icon">${isAccurate ? '✅' : '⚠️'}</span>
                                    <span class="check-label">${t('irr_convergence')}</span>
                                    <span class="check-value">${(summary.irr * 100).toFixed(4)}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="assumptions-verification">
                            <h6>${t('key_assumptions_verification')}</h6>
                            <ul>
                                <li><strong>${t('rental_growth')}:</strong> ${(inputs.rentalGrowthRate * 100).toFixed(1)}% ${t('per_annum')}</li>
                                <li><strong>${t('capital_growth')}:</strong> ${(inputs.capitalGrowthRate * 100).toFixed(1)}% ${t('per_annum')}</li>
                                <li><strong>${t('interest_rate')}:</strong> ${(inputs.interestRate * 100).toFixed(2)}% ${t('fixed_rate')}</li>
                                <li><strong>${t('holding_period')}:</strong> ${inputs.holdingPeriod} ${t('years')}</li>
                                <li><strong>${t('cgt_discount')}:</strong> ${inputs.holdingPeriod > 1 ? '50%' : '0%'} ${t('applicable')}</li>
                            </ul>
                        </div>
                    </div>
                `
            }
        ]
    };
    
    openDetailModal(config);
}

// 在控制台中提供示例数据加载功能
console.log('提示：默认方案已包含示例数据，或在控制台中输入 loadExampleData() 重新加载示例数据');