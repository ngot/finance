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
        
        return {
            'default': {
                name: '默认方案 (示例数据)',
                data: defaultData
            }
        };
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
        
        // 存储数据供弹窗使用
        this.currentYearlyAnalysis = yearlyAnalysis;
        this.currentInputs = inputs;
        
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
                    tension: 0.4,
                    fill: false,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }, {
                    label: '税后现金流',
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
        document.getElementById('modalTotalBenefits').textContent = this.formatCurrency(totalBenefits);
        document.getElementById('modalBenefitYears').textContent = `${benefitYears}年`;
        document.getElementById('modalTaxRate').textContent = `${(marginalTaxRate * 100).toFixed(1)}%`;
        
        // 生成年度明细
        this.generateYearlyDetail(yearlyAnalysis, inputs);
        
        // 生成抵扣分解
        this.generateBreakdownDetail(yearlyAnalysis, inputs);
    }

    generateYearlyDetail(yearlyAnalysis, inputs) {
        const marginalTaxRate = this.calculateMarginalTaxRate(inputs.personalIncome);
        const container = document.getElementById('yearlyDetailContent');
        
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
                        <span class="year-title">第${year.year}年</span>
                        <span class="year-benefit-amount ${hasBenefit ? 'positive' : 'zero'}">
                            ${hasBenefit ? this.formatCurrency(benefit) : '无优惠'}
                        </span>
                    </div>
                    <div class="year-details">
                        <div class="detail-grid">
                            <div class="detail-section">
                                <h6>收入明细</h6>
                                <div class="detail-item">
                                    <span class="detail-label">租金收入</span>
                                    <span class="detail-value">${this.formatCurrency(year.rentalIncome)}</span>
                                </div>
                            </div>
                            <div class="detail-section">
                                <h6>抵扣费用明细</h6>
                                <div class="detail-item">
                                    <span class="detail-label">贷款利息</span>
                                    <span class="detail-value">${this.formatCurrency(annualInterest)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">物业管理费</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.strataFees)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">市政费</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.councilRates)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">水费</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.waterRates)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">保险费</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.insurance)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">维护费用</span>
                                    <span class="detail-value">${this.formatCurrency(inputs.maintenance)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">中介管理费</span>
                                    <span class="detail-value">${this.formatCurrency(managementFeesAmount)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">折旧费用</span>
                                    <span class="detail-value">${this.formatCurrency(year.depreciation)}</span>
                                </div>
                                <div class="detail-item" style="border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
                                    <span class="detail-label"><strong>总抵扣费用</strong></span>
                                    <span class="detail-value"><strong>${this.formatCurrency(year.totalDeductions)}</strong></span>
                                </div>
                            </div>
                        </div>
                        <div class="calculation-summary">
                            <div class="detail-item">
                                <span class="detail-label">应税收入 (租金 - 抵扣)</span>
                                <span class="detail-value">${this.formatCurrency(year.taxableIncome)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">边际税率</span>
                                <span class="detail-value">${(marginalTaxRate * 100).toFixed(1)}%</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label"><strong>税务影响</strong></span>
                                <span class="detail-value"><strong>
                                    ${hasBenefit ? 
                                        `节税 ${this.formatCurrency(benefit)}` : 
                                        `应缴税 ${this.formatCurrency(Math.abs(year.taxImpact))}`
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
        let totalDepreciation = 0;
        let totalDeductions = 0;
        
        yearlyAnalysis.forEach(year => {
            const loanPayments = this.calculateLoanPayments(inputs.loanAmount, inputs.interestRate, inputs.loanTerm, inputs.repaymentType);
            const annualInterest = loanPayments.monthlyInterest * 12;
            const managementFeesAmount = year.rentalIncome * (inputs.managementFees / 100);
            const operatingExpenses = inputs.strataFees + inputs.councilRates + inputs.waterRates + 
                                    inputs.insurance + inputs.maintenance + managementFeesAmount;
            
            totalInterest += annualInterest;
            totalOperating += operatingExpenses;
            totalDepreciation += year.depreciation;
            totalDeductions += year.totalDeductions;
        });
        
        const html = `
            <div class="breakdown-summary">
                <h5>累计抵扣费用分解 (${inputs.holdingPeriod}年)</h5>
                
                <div class="breakdown-categories">
                    <div class="category-card">
                        <h6>贷款利息</h6>
                        <div class="category-amount">${this.formatCurrency(totalInterest)}</div>
                        <div class="category-percentage">${((totalInterest / totalDeductions) * 100).toFixed(1)}%</div>
                        <small>投资房贷款利息支出</small>
                    </div>
                    
                    <div class="category-card">
                        <h6>运营费用</h6>
                        <div class="category-amount">${this.formatCurrency(totalOperating)}</div>
                        <div class="category-percentage">${((totalOperating / totalDeductions) * 100).toFixed(1)}%</div>
                        <small>物业费、市政费、保险等</small>
                    </div>
                    
                    <div class="category-card">
                        <h6>折旧费用</h6>
                        <div class="category-amount">${this.formatCurrency(totalDepreciation)}</div>
                        <div class="category-percentage">${((totalDepreciation / totalDeductions) * 100).toFixed(1)}%</div>
                        <small>建筑和设备折旧</small>
                    </div>
                </div>
                
                <div class="breakdown-details">
                    <h6>运营费用明细</h6>
                    <div class="detail-breakdown">
                        <div class="breakdown-item">
                            <span>物业管理费</span>
                            <span>${this.formatCurrency(inputs.strataFees * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>市政费</span>
                            <span>${this.formatCurrency(inputs.councilRates * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>水费</span>
                            <span>${this.formatCurrency(inputs.waterRates * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>保险费</span>
                            <span>${this.formatCurrency(inputs.insurance * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>维护费用</span>
                            <span>${this.formatCurrency(inputs.maintenance * inputs.holdingPeriod)}</span>
                        </div>
                        <div class="breakdown-item">
                            <span>中介管理费</span>
                            <span>${this.formatCurrency(yearlyAnalysis.reduce((sum, year) => sum + (year.rentalIncome * inputs.managementFees / 100), 0))}</span>
                        </div>
                    </div>
                </div>
                
                <div class="depreciation-details">
                    <h6>折旧费用说明</h6>
                    <div class="depreciation-info">
                        <p><strong>建筑折旧 (Division 43):</strong> ${inputs.yearBuilt >= 1987 ? '适用' : '不适用'}</p>
                        <p><strong>设备折旧 (Division 40):</strong> ${new Date().getFullYear() - inputs.yearBuilt < 10 ? '适用' : '已过期'}</p>
                        <p><strong>年度折旧:</strong> ${this.formatCurrency(yearlyAnalysis[0]?.depreciation || 0)}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
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

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('taxBenefitsModal');
    if (event.target === modal) {
        closeTaxBenefitsModal();
    }
});

// 在控制台中提供示例数据加载功能
console.log('提示：默认方案已包含示例数据，或在控制台中输入 loadExampleData() 重新加载示例数据');