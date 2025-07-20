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
                        text: '年度现金流趋势',
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
                name: '现金流分析',
                content: `
                    <div class="breakdown-summary">
                        <h5>详细现金流分析</h5>
                        
                        <div class="cash-flow-explanation">
                            <h6>现金流构成说明：</h6>
                            <div class="explanation-grid">
                                <div class="explanation-item">
                                    <strong>第0年：</strong> 初始投资 (首付 + 购买成本)
                                </div>
                                <div class="explanation-item">
                                    <strong>第1-${inputs.holdingPeriod-1}年：</strong> 年度净现金流 (租金收入 - 所有费用 + 税务影响)
                                </div>
                                <div class="explanation-item">
                                    <strong>第${inputs.holdingPeriod}年：</strong> 年度净现金流 + 房产出售净收入 (售价 - 剩余贷款 - CGT)
                                </div>
                            </div>
                        </div>
                        
                        <div class="cash-flow-table">
                            <div class="table-header">
                                <span>年份</span>
                                <span>现金流构成</span>
                                <span>现金流金额</span>
                                <span>现值 (IRR=${(summary.irr * 100).toFixed(2)}%)</span>
                            </div>
                            ${cashFlows.map((flow, index) => {
                                const presentValue = flow / Math.pow(1 + summary.irr, index);
                                let flowDescription = '';
                                
                                if (index === 0) {
                                    flowDescription = '初始投资';
                                } else if (index === cashFlows.length - 1) {
                                    const normalFlow = yearlyAnalysis[index - 1].netCashFlow;
                                    const remainingLoan = window.calculator.calculateRemainingLoan(inputs, inputs.holdingPeriod);
                                    const netSaleProceeds = capitalGains.futureValue - remainingLoan - capitalGains.cgtTax;
                                    flowDescription = `年度现金流 + 出售净收入<br><small>年度: ${window.calculator.formatCurrency(normalFlow)}<br>出售: ${window.calculator.formatCurrency(capitalGains.futureValue)} - ${window.calculator.formatCurrency(remainingLoan)} - ${window.calculator.formatCurrency(capitalGains.cgtTax)} = ${window.calculator.formatCurrency(netSaleProceeds)}</small>`;
                                } else {
                                    flowDescription = '年度净现金流';
                                }
                                
                                return `
                                    <div class="table-row ${flow < 0 ? 'negative' : 'positive'}">
                                        <span>第${index}年</span>
                                        <span>${flowDescription}</span>
                                        <span>${window.calculator.formatCurrency(flow)}</span>
                                        <span>${window.calculator.formatCurrency(presentValue)}</span>
                                    </div>
                                `;
                            }).join('')}
                            <div class="table-footer">
                                <span><strong>NPV总计</strong></span>
                                <span><strong>所有现金流现值之和</strong></span>
                                <span><strong>${window.calculator.formatCurrency(cumulativeFlows[cumulativeFlows.length - 1])}</strong></span>
                                <span><strong>≈ $0</strong></span>
                            </div>
                        </div>
                        
                        <div class="calculation-verification">
                            <h6>计算验证：</h6>
                            <p><strong>IRR定义：</strong> 使净现值(NPV)等于零的折现率</p>
                            <p><strong>验证结果：</strong> 所有现金流按IRR=${(summary.irr * 100).toFixed(2)}%折现后的现值总和 ≈ $0</p>
                            <p><strong>计算正确性：</strong> ${Math.abs(cashFlows.reduce((sum, flow, index) => sum + flow / Math.pow(1 + summary.irr, index), 0)) < 1000 ? '✅ 计算正确' : '⚠️ 需要检查'}</p>
                        </div>
                        
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>现金流特征</h6>
                                <div class="category-amount">${cashFlows.filter(f => f > 0).length}</div>
                                <div class="category-percentage">正现金流年数</div>
                                <small>共${cashFlows.length - 1}年投资期</small>
                            </div>
                            <div class="category-card">
                                <h6>回本时间</h6>
                                <div class="category-amount">${cumulativeFlows.findIndex(cf => cf > 0) > 0 ? cumulativeFlows.findIndex(cf => cf > 0) : '未回本'}</div>
                                <div class="category-percentage">${cumulativeFlows.findIndex(cf => cf > 0) > 0 ? '年' : ''}</div>
                                <small>累计现金流转正时间</small>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'irrAnalysis',
                name: '结果分析',
                content: `
                    <div class="breakdown-summary">
                        <h5>IRR结果深度分析</h5>
                        
                        ${isNegative ? `
                            <div class="alert-section negative-irr">
                                <h6>⚠️ IRR为负值的原因分析</h6>
                                <p>当前IRR为 <strong>${(summary.irr * 100).toFixed(2)}%</strong>，表示投资产生亏损。主要原因可能包括：</p>
                                
                                <div class="reason-analysis">
                                    <div class="reason-item">
                                        <h6>1. 现金流不足</h6>
                                        <p>年度净现金流: ${yearlyAnalysis.every(y => y.netCashFlow < 0) ? '全部为负' : '部分为负'}</p>
                                        <p>这意味着租金收入无法覆盖所有费用和贷款还款。</p>
                                    </div>
                                    
                                    <div class="reason-item">
                                        <h6>2. 资本增值不足</h6>
                                        <p>预计资本增值: ${window.calculator.formatCurrency(capitalGains.capitalGain)}</p>
                                        <p>资本增值无法弥补持有期间的现金流亏损。</p>
                                    </div>
                                    
                                    <div class="reason-item">
                                        <h6>3. 高额税务成本</h6>
                                        <p>预计CGT: ${window.calculator.formatCurrency(capitalGains.cgtTax)}</p>
                                        <p>资本利得税进一步减少了最终回报。</p>
                                    </div>
                                </div>
                                
                                <div class="improvement-suggestions">
                                    <h6>改善建议：</h6>
                                    <ul>
                                        <li><strong>提高租金:</strong> 当前租金可能偏低，考虑市场调研</li>
                                        <li><strong>降低费用:</strong> 优化运营费用，如保险、维护等</li>
                                        <li><strong>调整贷款:</strong> 考虑更低利率或延长还款期</li>
                                        <li><strong>重新评估增值:</strong> 当前${inputs.capitalGrowthRate}%增值率可能过于乐观</li>
                                    </ul>
                                </div>
                            </div>
                        ` : `
                            <div class="alert-section positive-irr">
                                <h6>✅ IRR为正值 - 投资表现分析</h6>
                                <p>当前IRR为 <strong>${(summary.irr * 100).toFixed(2)}%</strong>，投资产生正回报。</p>
                            </div>
                        `}
                        
                        <div class="comparison-analysis">
                            <h6>IRR基准对比</h6>
                            <div class="benchmark-grid">
                                <div class="benchmark-item ${summary.irr > 0.12 ? 'current' : ''}">
                                    <span class="benchmark-label">优秀投资</span>
                                    <span class="benchmark-value">>12%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0.08 && summary.irr <= 0.12 ? 'current' : ''}">
                                    <span class="benchmark-label">良好投资</span>
                                    <span class="benchmark-value">8-12%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0.05 && summary.irr <= 0.08 ? 'current' : ''}">
                                    <span class="benchmark-label">一般投资</span>
                                    <span class="benchmark-value">5-8%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr > 0 && summary.irr <= 0.05 ? 'current' : ''}">
                                    <span class="benchmark-label">偏低回报</span>
                                    <span class="benchmark-value">0-5%</span>
                                </div>
                                <div class="benchmark-item ${summary.irr <= 0 ? 'current' : ''}">
                                    <span class="benchmark-label">投资亏损</span>
                                    <span class="benchmark-value"><0%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="sensitivity-analysis">
                            <h6>敏感性分析</h6>
                            <p>IRR对关键参数的敏感性：</p>
                            <div class="sensitivity-grid">
                                <div class="sensitivity-item">
                                    <span>租金 +10%</span>
                                    <span class="positive">IRR提升约1-2%</span>
                                </div>
                                <div class="sensitivity-item">
                                    <span>利率 -1%</span>
                                    <span class="positive">IRR提升约1-3%</span>
                                </div>
                                <div class="sensitivity-item">
                                    <span>增值率 +1%</span>
                                    <span class="positive">IRR提升约0.5-1%</span>
                                </div>
                                <div class="sensitivity-item">
                                    <span>购买价格 -5%</span>
                                    <span class="positive">IRR提升约1-2%</span>
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
                name: '抵扣优化',
                content: `
                    <div class="tax-explanation-detailed">
                        <h5>可抵扣费用优化建议</h5>
                        
                        <div class="explanation-section">
                            <h6>1. 主要可抵扣费用类别</h6>
                            <ul>
                                <li><strong>贷款利息:</strong> 投资房贷款的利息部分可全额抵扣</li>
                                <li><strong>物业管理费:</strong> 公寓的strata fees等物业费用</li>
                                <li><strong>市政费用:</strong> council rates, water rates等政府费用</li>
                                <li><strong>保险费用:</strong> 房东保险premiums</li>
                                <li><strong>维护费用:</strong> 修理和维护成本</li>
                                <li><strong>中介费用:</strong> 租赁管理费用</li>
                            </ul>
                        </div>
                        
                        <div class="explanation-section">
                            <h6>2. 抵扣优化策略</h6>
                            <ul>
                                <li><strong>记录保存:</strong> 保留所有费用收据和发票</li>
                                <li><strong>专业咨询:</strong> 定期咨询税务顾问</li>
                                <li><strong>费用分类:</strong> 区分可抵扣和不可抵扣费用</li>
                                <li><strong>时间规划:</strong> 合理安排维修和改善时间</li>
                            </ul>
                        </div>
                        
                        <div class="explanation-section">
                            <h6>3. 注意事项</h6>
                            <ul>
                                <li><strong>资本性支出:</strong> 大型改善项目可能不能立即抵扣</li>
                                <li><strong>个人使用:</strong> 如有个人使用需按比例计算</li>
                                <li><strong>ATO规定:</strong> 遵循澳洲税务局最新规定</li>
                                <li><strong>专业建议:</strong> 复杂情况建议咨询专业人士</li>
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
    
    const config = {
        title: '资本利得税 (CGT) 详细分析',
        summaryTitle: '预计资本利得税',
        summaryAmount: window.calculator.formatCurrency(capitalGains.cgtTax),
        summaryDetails: `
            <span>资本利得: <strong>${window.calculator.formatCurrency(capitalGains.capitalGain)}</strong></span>
            <span>CGT折扣: <strong>${capitalGains.cgtDiscount ? '50%' : '无'}</strong></span>
        `,
        tabs: [
            {
                id: 'cgtBreakdown',
                name: 'CGT计算',
                content: `
                    <div class="breakdown-summary">
                        <h5>资本利得税计算过程</h5>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">出售价格</span>
                                <span class="detail-value">${window.calculator.formatCurrency(capitalGains.futureValue)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">减：购买价格</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(inputs.purchasePrice)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">减：购买成本</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(inputs.purchaseCosts)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">资本利得</span>
                                <span class="detail-value">${window.calculator.formatCurrency(capitalGains.capitalGain)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">CGT折扣 (${capitalGains.cgtDiscount ? '50%' : '0%'})</span>
                                <span class="detail-value">-${window.calculator.formatCurrency(capitalGains.capitalGain - capitalGains.taxableCapitalGain)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">应税资本利得</span>
                                <span class="detail-value">${window.calculator.formatCurrency(capitalGains.taxableCapitalGain)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">边际税率</span>
                                <span class="detail-value">${(marginalTaxRate * 100).toFixed(1)}%</span>
                            </div>
                            <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                <span class="detail-label"><strong>应缴CGT</strong></span>
                                <span class="detail-value"><strong>${window.calculator.formatCurrency(capitalGains.cgtTax)}</strong></span>
                            </div>
                        </div>
                        <div class="breakdown-categories">
                            <div class="category-card">
                                <h6>CGT折扣</h6>
                                <div class="category-amount">${capitalGains.cgtDiscount ? '50%' : '0%'}</div>
                                <div class="category-percentage">${inputs.holdingPeriod > 1 ? '适用' : '不适用'}</div>
                                <small>持有超过12个月</small>
                            </div>
                            <div class="category-card">
                                <h6>节税金额</h6>
                                <div class="category-amount">${window.calculator.formatCurrency(capitalGains.capitalGain - capitalGains.taxableCapitalGain)}</div>
                                <div class="category-percentage">CGT折扣</div>
                                <small>相比无折扣情况</small>
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

// 在控制台中提供示例数据加载功能
console.log('提示：默认方案已包含示例数据，或在控制台中输入 loadExampleData() 重新加载示例数据');