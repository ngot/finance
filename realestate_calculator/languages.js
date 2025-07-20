// Language translations for Property Investment Calculator
const translations = {
    en: {
        // Header
        title: "Property Investment Calculator",
        subtitle: "Evaluate cash flow, capital growth and tax implications of property investments",
        
        // Profile Management
        profile_management: "Investment Portfolio Management",
        current_profile: "Current Profile:",
        default_profile: "Default Profile",
        new_profile: "New Profile",
        save_profile: "Save Profile",
        delete_profile: "Delete Profile",
        load_example: "Load Example",
        export_data: "Export Data",
        import_data: "Import Data",
        
        // Investment Information Input
        investment_info_input: "Investment Information Input",
        
        // Property Information
        property_info: "Property Information",
        purchase_price: "Purchase Price (AUD)",
        purchase_price_placeholder: "e.g.: 800000",
        purchase_costs: "Purchase Costs (AUD)",
        purchase_costs_placeholder: "e.g.: 40000",
        weekly_rent: "Weekly Rent (AUD)",
        weekly_rent_placeholder: "e.g.: 600",
        rental_growth_rate: "Annual Rental Growth Rate (%)",
        rental_growth_rate_placeholder: "e.g.: 3.0",
        property_type: "Property Type",
        
        // Property Type Options
        apartment: "Apartment",
        house: "House",
        townhouse: "Townhouse",
        
        // Loan Information
        loan_info: "Loan Information",
        loan_amount: "Loan Amount (AUD)",
        loan_amount_placeholder: "e.g.: 640000",
        interest_rate: "Interest Rate (%)",
        interest_rate_placeholder: "e.g.: 6.5",
        loan_term: "Loan Term (Years)",
        loan_term_placeholder: "e.g.: 30",
        repayment_type: "Repayment Type",
        principal_interest: "Principal & Interest",
        interest_only: "Interest Only",
        
        // Operating Expenses
        operating_expenses: "Operating Expenses",
        strata_fees: "Annual Strata Fees (AUD)",
        strata_fees_placeholder: "e.g.: 3000",
        council_rates: "Annual Council Rates (AUD)",
        council_rates_placeholder: "e.g.: 2000",
        water_rates: "Annual Water Rates (AUD)",
        water_rates_placeholder: "e.g.: 800",
        insurance: "Annual Insurance (AUD)",
        insurance_placeholder: "e.g.: 1200",
        maintenance: "Annual Maintenance & Repairs (AUD)",
        maintenance_placeholder: "e.g.: 2000",
        management_fees: "Property Management Fees (%)",
        management_fees_placeholder: "e.g.: 7.0",
        
        // Personal Tax Information
        personal_tax_info: "Personal Tax Information",
        personal_income: "Annual Personal Income (AUD)",
        personal_income_placeholder: "e.g.: 120000",
        other_deductions: "Other Tax Deductions (AUD)",
        other_deductions_placeholder: "e.g.: 5000",
        
        // Investment Assumptions
        investment_assumptions: "Investment Assumptions",
        capital_growth_rate: "Annual Capital Growth Rate (%)",
        capital_growth_rate_placeholder: "e.g.: 5.0",
        holding_period: "Holding Period (Years)",
        holding_period_placeholder: "e.g.: 10",
        
        // Calculate Button
        calculate_investment: "Calculate Investment Returns",
        
        // Results Section
        results_title: "Investment Analysis Report",
        investment_overview: "Investment Overview",
        initial_investment: "Total Initial Investment",
        expected_holding_period: "Expected Holding Period",
        expected_property_value: "Expected Property Value at Sale",
        
        // Return Analysis
        return_analysis: "Investment Return Analysis",
        irr: "Internal Rate of Return (IRR)",
        total_return: "Total After-Tax Return",
        annual_cash_flow: "Average Annual Cash Flow",
        capital_growth: "Total Capital Growth",
        total_rental_income: "Total Rental Income",
        total_tax_benefits: "Negative Gearing",
        gross_rental_yield: "Gross Rental Yield",
        net_rental_yield: "Net Rental Yield",
        
        // Tax Summary
        tax_summary: "Tax Summary",
        annual_tax_benefit: "Average Annual Tax Benefit",
        total_deductions: "Total Tax Deductions",
        cgt_payable: "Capital Gains Tax Payable",
        cgt_discount: "CGT 50% Discount Applied",
        
        // Selling Recommendations
        selling_recommendations: "Selling Time Recommendations",
        optimal_selling_time: "Optimal Selling Time",
        cgt_consideration: "CGT Consideration",
        
        // Cash Flow Chart
        cash_flow_chart_title: "Annual Cash Flow Analysis Chart",
        year: "Year",
        cash_flow: "Cash Flow (AUD)",
        
        // Modal Content
        tax_benefits_detailed_analysis: "Negative Gearing Detailed Analysis",
        total_tax_benefits_amount: "Negative Gearing Amount",
        benefit_years: "Benefit Years",
        marginal_tax_rate: "Marginal Tax Rate",
        yearly_details: "Annual Details",
        deduction_breakdown: "Deduction Breakdown",
        tax_explanation: "Tax Explanation",
        detailed_information: "Detailed Information",
        
        // Footer
        disclaimer_title: "Disclaimer",
        disclaimer_content: "All calculations provided by this calculator are based on user-entered assumptions and predictions and are for reference only. Actual results may vary due to market fluctuations, policy changes, and other factors. This tool does not constitute professional tax or investment advice. Users should consult qualified professional advisors before making any investment decisions.",
        
        // Tax Explanation Content
        australian_property_tax_mechanism: "Australian Property Investment Tax Mechanism",
        negative_gearing_title: "1. Negative Gearing",
        negative_gearing_description: "When the deductible expenses of a property investment exceed rental income, the resulting loss can be offset against the investor's other taxable income, thereby reducing overall tax liability.",
        negative_gearing_point1: "Applies to all types of investment properties",
        negative_gearing_point2: "Loss amount calculated as tax benefit at investor's marginal tax rate",
        negative_gearing_point3: "Unused losses can be carried forward across tax years",
        main_deductible_expenses: "2. Main Deductible Expenses",
        loan_interest_expense: "Loan Interest",
        loan_interest_description: "Interest portion of investment property loans",
        property_management_fees_expense: "Property Management Fees",
        property_management_description: "Apartment strata fees, etc.",
        council_fees_expense: "Council Fees",
        council_fees_description: "Council rates, water rates, etc.",
        insurance_expense: "Insurance",
        insurance_description: "Landlord insurance premiums",
        maintenance_expense: "Maintenance",
        maintenance_description: "Repair and maintenance costs",
        agent_fees_expense: "Agent Fees",
        agent_fees_description: "Rental management fees",
        depreciation_expense: "Depreciation",
        depreciation_description: "Building and equipment depreciation",
        depreciation_calculation: "3. Depreciation Calculation",
        division43_description: "Building structure depreciation, 2.5%/year for new buildings, 40 years",
        division40_description: "Equipment depreciation, such as air conditioning, carpets, etc.",
        depreciation_eligibility: "Only properties built after 1987 can claim building depreciation",
        tax_rate_impact: "4. Tax Rate Impact",
        tax_benefit_formula: "Tax Benefit Amount = Loss Amount × Marginal Tax Rate",
        
        // Additional Modal Content
        total_deductions_detailed_analysis: "Total Tax Deductions Detailed Analysis",
        investment_period: "Investment Period",
        average_annual_deduction: "Average Annual Deduction",
        expense_breakdown: "Expense Breakdown",
        loan_interest: "Loan Interest",
        operating_expenses: "Operating Expenses",
        investment_property_loan_interest: "Investment property loan interest expense",
        property_fees_council_insurance: "Property fees, council rates, insurance, etc.",
        annual_breakdown: "Annual Breakdown",
        deduction_categories: "Deduction Categories",
        tax_calculation_method: "Tax Calculation Method",
        
        // Modal Titles and Content
        initial_investment_detailed_analysis: "Initial Investment Detailed Analysis",
        capital_growth_detailed_analysis: "Total Capital Growth Detailed Analysis",
        rental_income_detailed_analysis: "Total Rental Income Detailed Analysis",
        after_tax_return_detailed_analysis: "Total After-Tax Return Detailed Analysis",
        irr_detailed_analysis: "Annualized Return Rate (IRR) Detailed Analysis",
        
        // Modal Tab Names
        cost_breakdown: "Cost Breakdown",
        investment_advice: "Investment Advice",
        growth_breakdown: "Growth Breakdown",
        growth_analysis: "Growth Analysis",
        rental_details: "Rental Details",
        rental_optimization: "Rental Optimization",
        return_composition: "Return Composition",
        irr_calculation_principle: "IRR Calculation Principle",
        cash_flow_analysis: "Cash Flow Analysis",
        irr_optimization: "IRR Optimization",
        
        // Modal Content Labels
        down_payment: "Down Payment",
        purchase_costs: "Purchase Costs",
        property_price: "Property Price",
        loan_amount: "Loan Amount",
        loan_ratio_lvr: "Loan Ratio (LVR)",
        initial_investment_total: "Total Initial Investment",
        initial_purchase_price: "Initial Purchase Price",
        annual_growth_rate: "Annual Growth Rate",
        holding_years: "Holding Years",
        expected_sale_price: "Expected Sale Price",
        minus_purchase_costs: "Less: Purchase Costs",
        net_capital_growth: "Net Capital Growth",
        annualized_growth_rate: "Annualized Growth Rate",
        total_growth_multiple: "Total Growth Multiple",
        property_value_growth_multiple: "Property value growth multiple",
        initial_weekly_rent: "Initial Weekly Rent",
        weekly_rent: "Weekly Rent",
        monthly_rent: "Monthly Rent",
        annual_rent: "Annual Rent",
        investment_term: "Investment Term",
        total_investment: "Total Investment",
        rental_income: "Rental Income",
        capital_appreciation: "Capital Appreciation",
        after_tax_net_appreciation: "After-tax net appreciation",
        initial_investment: "Initial Investment",
        cumulative_rental_income: "Cumulative Rental Income",
        net_capital_appreciation: "Net Capital Appreciation",
        after_tax_total_return: "Total After-Tax Return",
        return_multiple: "Return Multiple",
        annualized_return_rate_irr: "Annualized Return Rate (IRR)",
        irr_status: "IRR Status",
        negative_loss: "Negative (Loss)",
        positive_profit: "Positive (Profit)",
        
        // Detailed Modal Content Sections
        initial_investment_optimization_advice: "Initial Investment Optimization Advice",
        capital_growth_composition: "Capital Growth Composition",
        capital_growth_impact_factors: "Capital Growth Impact Factors",
        annual_rental_income_details: "Annual Rental Income Details",
        rental_income_optimization_strategy: "Rental Income Optimization Strategy",
        cumulative_deductible_expense_breakdown: "Cumulative Deductible Expense Breakdown",
        after_tax_total_return_composition: "After-Tax Total Return Composition",
        irr_calculation_principle_detailed: "IRR (Internal Rate of Return) Calculation Principle",
        
        // Content Headers and Descriptions
        loan_ratio_lvr_consideration: "Loan Ratio (LVR) Consideration",
        current_lvr: "Current LVR",
        below_80_percent: "Below 80%: Avoid loan insurance fees",
        between_80_95_percent: "80-95%: Need to pay LMI (Loan Insurance)",
        recommendation: "Recommendation",
        current_lvr_ideal: "Current LVR is ideal",
        consider_increasing_down_payment: "Consider increasing down payment to reduce LVR",
        purchase_cost_optimization: "Purchase Cost Optimization",
        stamp_duty: "Stamp duty: Different rates by state, first-time buyers may get discounts",
        legal_fees: "Legal fees: Shop around for cost-effective services",
        property_inspection: "Property inspection: Necessary investment to avoid future major repairs",
        loan_fees: "Loan fees: Compare fees and rates from different banks",
        
        // Capital Growth Content
        market_factors: "Market Factors",
        location: "Location: Transport convenience, school zones, commercial areas, etc.",
        supply_demand: "Supply and demand: Population growth, housing supply",
        infrastructure: "Infrastructure: New metro, schools, hospitals, etc.",
        economic_environment: "Economic environment: Interest rates, employment rate, GDP growth",
        risk_warning: "Risk Warning",
        market_volatility: "Market volatility: Property prices may experience cyclical adjustments",
        policy_impact: "Policy impact: Changes in tax and loan policies",
        forecast_limitations: "Forecast limitations: Long-term predictions have uncertainties",
        conservative_estimate_advice: "Advice: Conservative estimates, prepare for risks",
        
        // Rental Income Content
        improve_rental_income: "Improve Rental Income",
        property_renovation: "Property renovation: Moderate renovation to increase rent levels",
        facility_improvement: "Facility improvement: Air conditioning, dishwasher and other value-added facilities",
        regular_adjustment: "Regular adjustment: Adjust rent according to market conditions",
        quality_tenants: "Quality tenants: Stable tenants reduce vacancy periods",
        rental_yield: "Rental Yield",
        current_gross_rental_yield: "Current gross rental yield",
        excellent_above_6: "Excellent: Above 6%",
        good_4_to_6: "Good: 4-6%",
        average_3_to_4: "Average: 3-4%",
        low_below_3: "Low: Below 3%",
        
        // IRR Content
        what_is_irr: "What is IRR?",
        irr_definition: "IRR is the discount rate that makes the net present value (NPV) of an investment equal to zero. Simply put, it's the annualized rate that makes all cash inflows equal to cash outflows in present value terms.",
        irr_calculation_formula: "IRR Calculation Formula:",
        irr_formula: "NPV = 0 = CF₀ + CF₁/(1+IRR)¹ + CF₂/(1+IRR)² + ... + CFₙ/(1+IRR)ⁿ",
        irr_formula_note: "Where: CF₀ is initial investment (negative), CF₁ to CFₙ are annual cash flows",
        irr_vs_simple_return: "IRR vs Simple Return Rate",
        irr_considers_time_value: "IRR considers time value",
        calculation_method: "Calculation Method",
        newton_method: "Newton Method",
        iterative_solution: "Iterative Solution",
        numerical_method: "Numerical method to solve equation",
        irr_calculation_steps: "IRR Calculation Steps:",
        collect_cash_flows: "1. Collect all cash flows",
        initial_plus_annual_plus_final: "Initial investment + Annual cash flows + Final sale price",
        set_npv_equation: "2. Set NPV equation",
        npv_equals_zero: "NPV = 0",
        iterate_solve_irr: "3. Iterate to solve IRR",
        numerical_method_find_rate: "Use numerical method to find the rate that makes NPV=0",
        
        // Tax Impact Labels
        tax_impact: "Tax Impact",
        tax_savings: "Tax Savings",
        tax_payable: "Tax Payable",
        
        // Cash Flow Analysis Labels
        detailed_cash_flow_analysis: "Detailed Cash Flow Analysis",
        cash_flow_composition_explanation: "Cash Flow Composition Explanation:",
        year_0: "Year 0:",
        initial_investment_down_payment_costs: "Initial investment (down payment + purchase costs)",
        years_1_to_n: "Years 1-{n}:",
        annual_net_cash_flow_description: "Annual net cash flow (rental income - all expenses + tax impact)",
        year_final: "Year {n}:",
        annual_plus_sale_proceeds: "Annual net cash flow + property sale net proceeds (sale price - remaining loan - CGT)",
        cash_flow_amount: "Cash Flow Amount",
        present_value: "Present Value (IRR={irr}%)",
        cash_flow_composition: "Cash Flow Composition",
        initial_investment: "Initial Investment",
        annual_net_cash_flow: "Annual Net Cash Flow",
        annual_plus_sale_net_proceeds: "Annual + Sale Net Proceeds",
        annual: "Annual",
        sale: "Sale",
        npv_total: "NPV Total",
        sum_of_all_present_values: "Sum of all cash flow present values",
        
        // IRR Optimization Labels
        irr_result_deep_analysis: "IRR Result Deep Analysis",
        calculation_verification: "Calculation Verification:",
        irr_definition_verification: "IRR Definition: The discount rate that makes net present value (NPV) equal to zero",
        current_npv_result: "Current NPV result: approximately $0, confirming IRR calculation accuracy",
        investment_decision_analysis: "Investment Decision Analysis",
        irr_benchmark_comparison: "IRR vs Benchmark Comparison",
        excellent_investment: "Excellent Investment",
        good_investment: "Good Investment", 
        average_investment: "Average Investment",
        low_return: "Low Return",
        investment_loss: "Investment Loss",
        excellent_investment_desc: "Outstanding returns, significantly above market average",
        good_investment_desc: "Solid returns, above most market benchmarks",
        average_investment_desc: "Moderate returns, comparable to market average",
        low_return_desc: "Below average returns, consider optimization",
        investment_loss_desc: "Negative returns, requires immediate review",
        current_irr_result: "Current IRR Result",
        market_benchmark_comparison: "Market Benchmark Comparison",
        investment_recommendation: "Investment Recommendation",
        excellent_investment_recommendation: "Excellent investment opportunity with outstanding returns. Consider proceeding with confidence.",
        good_investment_recommendation: "Good investment with solid returns. Proceed with standard due diligence.",
        average_investment_recommendation: "Average investment returns. Consider optimizing parameters or exploring alternatives.",
        low_return_recommendation: "Below average returns. Review investment parameters and consider improvements.",
        investment_loss_recommendation: "Investment shows negative returns. Strongly recommend reviewing all assumptions and parameters.",
        market_interest_rate: "Market Interest Rate",
        investment_property_loan_rate: "Investment Property Loan Rate",
        stock_market_average_return: "Stock Market Average Return",
        irr_npv_zero_rate: "The discount rate that makes Net Present Value (NPV) equal to zero",
        verification_result: "Verification Result",
        all_cash_flows_discounted_sum: "Sum of all cash flows discounted at IRR={irr}% ≈ $0",
        calculation_accuracy: "Calculation Accuracy",
        calculation_correct: "Calculation Correct",
        needs_review: "Needs Review",
        irr_parameter_sensitivity: "IRR sensitivity to key parameters",
        rent_increase_10: "Rent +10%",
        irr_improvement_1_2: "IRR improves ~1-2%",
        interest_rate_decrease_1: "Interest Rate -1%",
        irr_improvement_1_3: "IRR improves ~1-3%",
        growth_rate_increase_1: "Growth Rate +1%",
        irr_improvement_0_5_1: "IRR improves ~0.5-1%",
        purchase_price_decrease_5: "Purchase Price -5%",
        cgt_detailed_analysis: "Capital Gains Tax (CGT) Detailed Analysis",
        expected_cgt: "Expected CGT",
        capital_gain: "Capital Gain",
        none: "None",
        cgt_calculation: "CGT Calculation",
        cgt_calculation_process: "Capital Gains Tax Calculation Process",
        sale_price: "Sale Price",
        minus_purchase_price: "Less: Purchase Price",
        minus_purchase_costs: "Less: Purchase Costs",
        taxable_capital_gain: "Taxable Capital Gain",
        marginal_tax_rate: "Marginal Tax Rate",
        applicable: "Applicable",
        not_applicable: "Not Applicable",
        tax_savings_amount: "Tax Savings Amount",
        compared_to_no_discount: "Compared to no discount scenario",
        cgt_optimization_strategy: "CGT Optimization Strategy",
        cgt_discount_applicable: "CGT Discount Applicable",
        cgt_discount_not_applicable: "CGT Discount Not Applicable",
        cgt_timing_strategies: "CGT Timing Strategies",
        hold_over_12_months: "Hold Over 12 Months",
        qualify_for_50_percent_discount: "Qualify for 50% discount",
        income_timing: "Income Timing",
        sell_in_lower_income_year: "Sell in a lower income year",
        capital_losses: "Capital Losses",
        offset_with_capital_losses: "Offset with capital losses",
        installment_sales: "Installment Sales",
        spread_capital_gains_over_years: "Spread capital gains over multiple years",
        cgt_impact_analysis: "CGT Impact Analysis",
        without_cgt_discount: "Without CGT Discount",
        with_cgt_discount: "With CGT Discount",
        tax_savings: "Tax Savings",
        cgt_scenarios_analysis: "CGT Scenarios Analysis",
        different_holding_periods: "Different Holding Periods",
        different_income_levels: "Different Income Levels",
        current: "Current",
        discount: "Discount",
        stock_market_average_return: "Stock Market Average Return",
        risk_free_rate_bonds: "Risk-free Rate (Bonds)",
        irr_performance_evaluation: "IRR Performance Evaluation",
        break_even_analysis: "Break-even Analysis",
        sensitivity_analysis: "Sensitivity Analysis",
        optimization_suggestions: "Optimization Suggestions",
        
        // Negative IRR Analysis
        negative_irr_reason_analysis: "⚠️ Reasons for Negative IRR Analysis",
        negative_irr_explanation: "Current IRR is {irr}%, indicating the investment generates a loss. Main reasons may include:",
        cash_flow_insufficient: "1. Insufficient Cash Flow",
        annual_net_cash_flow: "Annual net cash flow: {status}",
        all_negative: "All negative",
        partially_negative: "Partially negative",
        rental_cannot_cover_expenses: "This means rental income cannot cover all expenses and loan repayments.",
        capital_growth_insufficient: "2. Insufficient Capital Growth",
        expected_capital_growth: "Expected capital growth: {amount}",
        capital_growth_cannot_offset: "Capital growth cannot offset cash flow losses during holding period.",
        high_tax_costs: "3. High Tax Costs",
        expected_cgt: "Expected CGT: {amount}",
        cgt_reduces_final_return: "Capital gains tax further reduces final returns.",
        improvement_suggestions: "Improvement Suggestions:",
        increase_rent: "Increase Rent: Current rent may be low, consider market research",
        reduce_expenses: "Reduce Expenses: Optimize operating costs like insurance, maintenance, etc.",
        adjust_loan: "Adjust Loan: Consider lower interest rates or extended repayment terms",
        reassess_growth: "Reassess Growth: Current {rate}% growth rate may be overly optimistic",
        
        // Positive IRR Analysis
        positive_irr_performance: "✅ Positive IRR - Investment Performance Analysis",
        positive_irr_explanation: "Current IRR is {irr}%, the investment generates positive returns.",
        
        // Benchmark Comparison
        excellent_investment: "Excellent Investment",
        good_investment: "Good Investment",
        average_investment: "Average Investment",
        below_average_investment: "Below Average Investment",
        
        // Selling Recommendations
        selling_recommendation_intro: "Based on your investment assumptions, here are the optimal selling time recommendations:",
        cgt_discount_benefit: "CGT 50% Discount Benefit",
        holding_over_12_months: "Holding the property for more than 12 months qualifies for the 50% CGT discount",
        optimal_selling_period: "Optimal Selling Period",
        years_recommendation: "years is recommended for optimal after-tax returns",
        market_considerations: "Market Considerations",
        consult_professional: "Please consult with qualified tax and investment professionals before making final decisions.",
        short_term_holding_risk: "Short-term Holding Risk Alert",
        short_term_holding_warning: "You plan to hold the property for {years} year(s), which means you cannot enjoy the 50% capital gains tax discount. Consider holding for more than 12 months to obtain tax benefits.",
        good_investment_performance: "Good Investment Performance",
        moderate_investment_performance: "Moderate Investment Performance",
        poor_investment_performance: "Investment Performance Needs Improvement",
        good_performance_description: "Based on your assumptions, this investment has an annual return rate of {irr}%, showing good performance. Selling after holding for {years} years allows you to enjoy the 50% CGT discount, making it a reasonable investment period.",
        moderate_performance_description: "This investment has an annual return rate of {irr}%, showing moderate performance. Consider adjusting rental expectations or looking for areas with better growth potential.",
        poor_performance_description: "This investment has an annual return rate of only {irr}%, which may not be as good as other investment options. Consider re-evaluating investment parameters or exploring other investment opportunities.",
        tax_advantage: "Tax Advantage",
        cgt_discount_benefit_description: "Since you're holding for more than 12 months, you can enjoy the 50% capital gains tax discount, saving approximately {amount} in taxes.",
        pre_tax_cash_flow: "Pre-tax Cash Flow",
        after_tax_cash_flow: "After-tax Cash Flow",
        
        // Common
        years: "years",
        year_short: "yr",
        aud: "AUD",
        percent: "%",
        yes: "Yes",
        no: "No",
        
        // Messages
        profile_created: "New profile created successfully",
        profile_saved: "Profile saved successfully",
        profile_deleted: "Profile deleted successfully",
        example_loaded: "Example data loaded successfully",
        data_exported: "Data exported successfully",
        data_imported: "Data imported successfully",
        invalid_file: "Invalid file format",
        calculation_complete: "Calculation completed successfully",
        
        // Validation Messages
        required_field: "This field is required",
        invalid_number: "Please enter a valid number",
        positive_number: "Please enter a positive number",
        percentage_range: "Please enter a percentage between 0 and 100"
    },
    
    zh: {
        // Header
        title: "房地产投资计算器",
        subtitle: "评估房地产投资的现金流、资本增值和税务影响",
        
        // Profile Management
        profile_management: "投资方案管理",
        current_profile: "当前方案:",
        default_profile: "默认方案",
        new_profile: "新建方案",
        save_profile: "保存方案",
        delete_profile: "删除方案",
        load_example: "加载示例",
        export_data: "导出数据",
        import_data: "导入数据",
        
        // Investment Information Input
        investment_info_input: "投资信息输入",
        
        // Property Information
        property_info: "房产信息",
        purchase_price: "购买价格 (AUD)",
        purchase_price_placeholder: "例如: 800000",
        purchase_costs: "购买成本 (AUD)",
        purchase_costs_placeholder: "例如: 40000",
        weekly_rent: "每周租金 (AUD)",
        weekly_rent_placeholder: "例如: 600",
        rental_growth_rate: "年度租金增长率 (%)",
        rental_growth_rate_placeholder: "例如: 3.0",
        property_type: "房产类型",
        
        // Property Type Options
        apartment: "公寓",
        house: "独立屋",
        townhouse: "联排别墅",
        
        // Loan Information
        loan_info: "贷款信息",
        loan_amount: "贷款金额 (AUD)",
        loan_amount_placeholder: "例如: 640000",
        interest_rate: "贷款利率 (%)",
        interest_rate_placeholder: "例如: 6.5",
        loan_term: "贷款期限 (年)",
        loan_term_placeholder: "例如: 30",
        repayment_type: "还款类型",
        principal_interest: "本息同还",
        interest_only: "只付利息",
        
        // Operating Expenses
        operating_expenses: "运营费用",
        strata_fees: "年度物业费 (AUD)",
        strata_fees_placeholder: "例如: 3000",
        council_rates: "年度市政费 (AUD)",
        council_rates_placeholder: "例如: 2000",
        water_rates: "年度水费 (AUD)",
        water_rates_placeholder: "例如: 800",
        insurance: "年度保险费 (AUD)",
        insurance_placeholder: "例如: 1200",
        maintenance: "年度维护费 (AUD)",
        maintenance_placeholder: "例如: 2000",
        management_fees: "物业管理费 (%)",
        management_fees_placeholder: "例如: 7.0",
        
        // Personal Tax Information
        personal_tax_info: "个人税务信息",
        personal_income: "年收入 (AUD)",
        personal_income_placeholder: "例如: 120000",
        other_deductions: "其他税务抵扣 (AUD)",
        other_deductions_placeholder: "例如: 5000",
        
        // Investment Assumptions
        investment_assumptions: "投资假设",
        capital_growth_rate: "年度资本增值率 (%)",
        capital_growth_rate_placeholder: "例如: 5.0",
        holding_period: "持有年限 (年)",
        holding_period_placeholder: "例如: 10",
        
        // Calculate Button
        calculate_investment: "计算投资回报",
        
        // Results Section
        results_title: "投资分析报告",
        investment_overview: "投资概览",
        initial_investment: "初始投资总额",
        expected_holding_period: "预计持有年限",
        expected_property_value: "预计出售时房产价值",
        
        // Return Analysis
        return_analysis: "投资回报分析",
        irr: "内部收益率 (IRR)",
        total_return: "税后总回报",
        annual_cash_flow: "平均年度现金流",
        capital_growth: "总资本增值",
        total_rental_income: "累计租金收入",
        total_tax_benefits: "负扣税",
        gross_rental_yield: "毛租金收益率",
        net_rental_yield: "净租金收益率",
        
        // Tax Summary
        tax_summary: "税务总结",
        annual_tax_benefit: "平均年度税务优惠",
        total_deductions: "累计可抵扣费用",
        cgt_payable: "预计资本利得税 (CGT)",
        cgt_discount: "CGT折扣适用",
        
        // Selling Recommendations
        selling_recommendations: "出售时机建议",
        optimal_selling_time: "最佳出售时机",
        cgt_consideration: "CGT考虑因素",
        
        // Cash Flow Chart
        cash_flow_chart_title: "年度现金流分析图表",
        year: "年份",
        cash_flow: "现金流 (AUD)",
        
        // Modal Content
        tax_benefits_detailed_analysis: "负扣税详细分析",
        total_tax_benefits_amount: "负扣税总额",
        benefit_years: "受益年数",
        marginal_tax_rate: "边际税率",
        yearly_details: "年度明细",
        deduction_breakdown: "抵扣分解",
        tax_explanation: "税务说明",
        detailed_information: "详细信息",
        
        // Footer
        disclaimer_title: "免责声明",
        disclaimer_content: "本计算器提供的所有计算均基于用户输入的假设和预测，仅供参考。实际结果可能因市场波动、政策变化等因素而有所不同。本工具不构成专业的税务或投资建议，用户在做出任何投资决策前应咨询合格的专业顾问。",
        
        // Tax Explanation Content
        australian_property_tax_mechanism: "澳大利亚房产投资税务机制",
        negative_gearing_title: "1. 负扣税 (Negative Gearing)",
        negative_gearing_description: "当房产投资的可抵扣费用超过租金收入时，产生的亏损可以抵扣投资者的其他应税收入，从而减少总体税款。",
        negative_gearing_point1: "适用于所有类型的投资房产",
        negative_gearing_point2: "亏损金额按投资者的边际税率计算税务优惠",
        negative_gearing_point3: "可以跨年度结转未使用的亏损",
        main_deductible_expenses: "2. 主要可抵扣费用",
        loan_interest_expense: "贷款利息",
        loan_interest_description: "投资房贷款的利息部分",
        property_management_fees_expense: "物业管理费",
        property_management_description: "公寓的strata fees等",
        council_fees_expense: "市政费用",
        council_fees_description: "council rates, water rates等",
        insurance_expense: "保险费用",
        insurance_description: "房东保险premiums",
        maintenance_expense: "维护费用",
        maintenance_description: "修理和维护成本",
        agent_fees_expense: "中介费用",
        agent_fees_description: "租赁管理费用",
        depreciation_expense: "折旧费用",
        depreciation_description: "建筑和设备折旧",
        depreciation_calculation: "3. 折旧计算",
        division43_description: "建筑结构折旧，新建筑2.5%/年，40年",
        division40_description: "设备折旧，如空调、地毯等",
        depreciation_eligibility: "只有1987年后建造的房产可以申请建筑折旧",
        tax_rate_impact: "4. 税率影响",
        tax_benefit_formula: "税务优惠金额 = 亏损金额 × 边际税率",
        
        // Additional Modal Content
        total_deductions_detailed_analysis: "累计可抵扣费用详细分析",
        investment_period: "投资期限",
        average_annual_deduction: "年均抵扣",
        expense_breakdown: "费用分解",
        loan_interest: "贷款利息",
        operating_expenses: "运营费用",
        investment_property_loan_interest: "投资房贷款利息支出",
        property_fees_council_insurance: "物业费、市政费、保险等",
        annual_breakdown: "年度分解",
        deduction_categories: "抵扣分类",
        tax_calculation_method: "税务计算方法",
        
        // Modal Titles and Content
        initial_investment_detailed_analysis: "初始投资总额详细分析",
        capital_growth_detailed_analysis: "总资本增值详细分析",
        rental_income_detailed_analysis: "累计租金收入详细分析",
        after_tax_return_detailed_analysis: "税后总回报详细分析",
        irr_detailed_analysis: "年化回报率 (IRR) 详细分析",
        
        // Modal Tab Names
        cost_breakdown: "费用分解",
        investment_advice: "投资建议",
        growth_breakdown: "增值分解",
        growth_analysis: "增值分析",
        rental_details: "租金明细",
        rental_optimization: "租金优化",
        return_composition: "回报构成",
        irr_calculation_principle: "IRR计算原理",
        cash_flow_analysis: "现金流分析",
        irr_optimization: "IRR优化",
        
        // Modal Content Labels
        down_payment: "首付款",
        purchase_costs: "购买成本",
        property_price: "房产价格",
        loan_amount: "贷款金额",
        loan_ratio_lvr: "贷款比例 (LVR)",
        initial_investment_total: "初始投资总额",
        initial_purchase_price: "初始购买价格",
        annual_growth_rate: "年度增值率",
        holding_years: "持有年限",
        expected_sale_price: "预计售价",
        minus_purchase_costs: "减：购买成本",
        net_capital_growth: "净资本增值",
        annualized_growth_rate: "年化增值率",
        total_growth_multiple: "总增值倍数",
        property_value_growth_multiple: "房产价值增长倍数",
        initial_weekly_rent: "初始周租金",
        weekly_rent: "周租金",
        monthly_rent: "月租金",
        annual_rent: "年租金",
        investment_term: "投资期限",
        total_investment: "总投入",
        rental_income: "租金收入",
        capital_appreciation: "资本增值",
        after_tax_net_appreciation: "扣除CGT后净增值",
        initial_investment: "初始投资",
        cumulative_rental_income: "累计租金收入",
        net_capital_appreciation: "净资本增值",
        after_tax_total_return: "税后总回报",
        return_multiple: "回报倍数",
        annualized_return_rate_irr: "年化回报率 (IRR)",
        irr_status: "IRR状态",
        negative_loss: "负值 (亏损)",
        positive_profit: "正值 (盈利)",
        
        // Detailed Modal Content Sections
        initial_investment_optimization_advice: "初始投资优化建议",
        capital_growth_composition: "资本增值构成",
        capital_growth_impact_factors: "资本增值影响因素",
        annual_rental_income_details: "年度租金收入明细",
        rental_income_optimization_strategy: "租金收入优化策略",
        cumulative_deductible_expense_breakdown: "累计抵扣费用分解",
        after_tax_total_return_composition: "税后总回报构成",
        irr_calculation_principle_detailed: "IRR (内部收益率) 计算原理",
        
        // Content Headers and Descriptions
        loan_ratio_lvr_consideration: "贷款比例 (LVR) 考虑",
        current_lvr: "当前LVR",
        below_80_percent: "80%以下: 避免贷款保险费用",
        between_80_95_percent: "80-95%: 需要支付LMI (贷款保险)",
        recommendation: "建议",
        current_lvr_ideal: "当前LVR较为理想",
        consider_increasing_down_payment: "考虑增加首付以降低LVR",
        purchase_cost_optimization: "购买成本优化",
        stamp_duty: "印花税: 各州税率不同，首次购房可能有优惠",
        legal_fees: "律师费: 货比三家，选择性价比高的服务",
        property_inspection: "房屋检查: 必要的投资，避免后续大额维修",
        loan_fees: "贷款费用: 比较不同银行的费用和利率",
        
        // Capital Growth Content
        market_factors: "市场因素",
        location: "地段位置: 交通便利、学区、商圈等",
        supply_demand: "供需关系: 人口增长、住房供应量",
        infrastructure: "基础设施: 新建地铁、学校、医院等",
        economic_environment: "经济环境: 利率、就业率、GDP增长",
        risk_warning: "风险提示",
        market_volatility: "市场波动: 房价可能出现周期性调整",
        policy_impact: "政策影响: 税收、贷款政策变化",
        forecast_limitations: "预测局限: 长期预测存在不确定性",
        conservative_estimate_advice: "建议: 保守估计，做好风险准备",
        
        // Rental Income Content
        improve_rental_income: "提高租金收入",
        property_renovation: "房屋装修: 适度装修提升租金水平",
        facility_improvement: "设施完善: 空调、洗碗机等增值设施",
        regular_adjustment: "定期调整: 根据市场行情调整租金",
        quality_tenants: "优质租客: 稳定租客减少空置期",
        rental_yield: "租金收益率",
        current_gross_rental_yield: "当前毛租金收益率",
        excellent_above_6: "优秀: 6%以上",
        good_4_to_6: "良好: 4-6%",
        average_3_to_4: "一般: 3-4%",
        low_below_3: "偏低: 3%以下",
        
        // IRR Content
        what_is_irr: "什么是IRR？",
        irr_definition: "IRR是使投资净现值 (NPV) 等于零的折现率。简单说，就是让所有现金流入的现值等于现金流出现值的年化利率。",
        irr_calculation_formula: "IRR计算公式：",
        irr_formula: "NPV = 0 = CF₀ + CF₁/(1+IRR)¹ + CF₂/(1+IRR)² + ... + CFₙ/(1+IRR)ⁿ",
        irr_formula_note: "其中：CF₀为初始投资(负值)，CF₁到CFₙ为各年现金流",
        irr_vs_simple_return: "IRR vs 简单回报率",
        irr_considers_time_value: "IRR考虑了时间价值",
        calculation_method: "计算方法",
        newton_method: "牛顿法",
        iterative_solution: "迭代求解",
        numerical_method: "数值方法求解方程",
        irr_calculation_steps: "IRR计算步骤：",
        collect_cash_flows: "1. 收集所有现金流",
        initial_plus_annual_plus_final: "初始投资 + 年度现金流 + 最终售价",
        set_npv_equation: "2. 设定NPV方程",
        npv_equals_zero: "NPV = 0",
        iterate_solve_irr: "3. 迭代求解IRR",
        numerical_method_find_rate: "使用数值方法找到使NPV=0的利率",
        
        // Tax Impact Labels
        tax_impact: "税务影响",
        tax_savings: "节税",
        tax_payable: "应缴税",
        
        // Cash Flow Analysis Labels
        detailed_cash_flow_analysis: "详细现金流分析",
        cash_flow_composition_explanation: "现金流构成说明：",
        year_0: "第0年：",
        initial_investment_down_payment_costs: "初始投资 (首付 + 购买成本)",
        years_1_to_n: "第1-{n}年：",
        annual_net_cash_flow_description: "年度净现金流 (租金收入 - 所有费用 + 税务影响)",
        year_final: "第{n}年：",
        annual_plus_sale_proceeds: "年度净现金流 + 房产出售净收入 (售价 - 剩余贷款 - CGT)",
        cash_flow_amount: "现金流金额",
        present_value: "现值 (IRR={irr}%)",
        cash_flow_composition: "现金流构成",
        initial_investment: "初始投资",
        annual_net_cash_flow: "年度净现金流",
        annual_plus_sale_net_proceeds: "年度现金流 + 出售净收入",
        annual: "年度",
        sale: "出售",
        npv_total: "NPV总计",
        sum_of_all_present_values: "所有现金流现值之和",
        
        // IRR Optimization Labels
        irr_result_deep_analysis: "IRR结果深度分析",
        calculation_verification: "计算验证：",
        irr_definition_verification: "IRR定义：使净现值(NPV)等于零的折现率",
        current_npv_result: "当前NPV结果：约为$0，确认IRR计算准确性",
        investment_decision_analysis: "投资决策分析",
        irr_benchmark_comparison: "IRR基准对比",
        excellent_investment: "优秀投资",
        good_investment: "良好投资",
        average_investment: "一般投资", 
        low_return: "偏低回报",
        investment_loss: "投资亏损",
        excellent_investment_desc: "卓越回报，显著超过市场平均水平",
        good_investment_desc: "稳健回报，超过大多数市场基准",
        average_investment_desc: "中等回报，与市场平均水平相当",
        low_return_desc: "低于平均回报，建议优化",
        investment_loss_desc: "负回报，需要立即审查",
        current_irr_result: "当前IRR结果",
        market_benchmark_comparison: "市场基准对比",
        investment_recommendation: "投资建议",
        excellent_investment_recommendation: "优秀的投资机会，回报卓越。建议充满信心地进行投资。",
        good_investment_recommendation: "良好的投资，回报稳健。按标准尽职调查程序进行。",
        average_investment_recommendation: "平均投资回报。考虑优化参数或探索其他选择。",
        low_return_recommendation: "低于平均回报。审查投资参数并考虑改进。",
        investment_loss_recommendation: "投资显示负回报。强烈建议审查所有假设和参数。",
        market_interest_rate: "市场利率",
        investment_property_loan_rate: "投资房贷款利率",
        stock_market_average_return: "股市平均回报",
        irr_npv_zero_rate: "使净现值(NPV)等于零的折现率",
        verification_result: "验证结果",
        all_cash_flows_discounted_sum: "所有现金流按IRR={irr}%折现后的现值总和 ≈ $0",
        calculation_accuracy: "计算正确性",
        calculation_correct: "计算正确",
        needs_review: "需要检查",
        irr_parameter_sensitivity: "IRR对关键参数的敏感性",
        rent_increase_10: "租金 +10%",
        irr_improvement_1_2: "IRR提升约1-2%",
        interest_rate_decrease_1: "利率 -1%",
        irr_improvement_1_3: "IRR提升约1-3%",
        growth_rate_increase_1: "增值率 +1%",
        irr_improvement_0_5_1: "IRR提升约0.5-1%",
        purchase_price_decrease_5: "购买价格 -5%",
        cgt_detailed_analysis: "资本利得税 (CGT) 详细分析",
        expected_cgt: "预计资本利得税",
        capital_gain: "资本利得",
        none: "无",
        cgt_calculation: "CGT计算",
        cgt_calculation_process: "资本利得税计算过程",
        sale_price: "出售价格",
        minus_purchase_price: "减：购买价格",
        minus_purchase_costs: "减：购买成本",
        taxable_capital_gain: "应税资本利得",
        marginal_tax_rate: "边际税率",
        applicable: "适用",
        not_applicable: "不适用",
        tax_savings_amount: "节税金额",
        compared_to_no_discount: "相比无折扣情况",
        cgt_optimization_strategy: "CGT优化策略",
        cgt_discount_applicable: "CGT折扣适用",
        cgt_discount_not_applicable: "CGT折扣不适用",
        cgt_timing_strategies: "CGT时机策略",
        hold_over_12_months: "持有超过12个月",
        qualify_for_50_percent_discount: "符合50%折扣条件",
        income_timing: "收入时机",
        sell_in_lower_income_year: "在低收入年份出售",
        capital_losses: "资本损失",
        offset_with_capital_losses: "用资本损失抵消",
        installment_sales: "分期销售",
        spread_capital_gains_over_years: "将资本利得分摊到多年",
        cgt_impact_analysis: "CGT影响分析",
        without_cgt_discount: "无CGT折扣",
        with_cgt_discount: "有CGT折扣",
        tax_savings: "节税金额",
        cgt_scenarios_analysis: "CGT情景分析",
        different_holding_periods: "不同持有期",
        different_income_levels: "不同收入水平",
        current: "当前",
        discount: "折扣",
        stock_market_average_return: "股市平均回报",
        risk_free_rate_bonds: "无风险利率(债券)",
        irr_performance_evaluation: "IRR表现评估",
        break_even_analysis: "盈亏平衡分析",
        sensitivity_analysis: "敏感性分析",
        optimization_suggestions: "优化建议",
        
        // Negative IRR Analysis
        negative_irr_reason_analysis: "⚠️ IRR为负值的原因分析",
        negative_irr_explanation: "当前IRR为 {irr}%，表示投资产生亏损。主要原因可能包括：",
        cash_flow_insufficient: "1. 现金流不足",
        annual_net_cash_flow: "年度净现金流: {status}",
        all_negative: "全部为负",
        partially_negative: "部分为负",
        rental_cannot_cover_expenses: "这意味着租金收入无法覆盖所有费用和贷款还款。",
        capital_growth_insufficient: "2. 资本增值不足",
        expected_capital_growth: "预计资本增值: {amount}",
        capital_growth_cannot_offset: "资本增值无法弥补持有期间的现金流亏损。",
        high_tax_costs: "3. 高额税务成本",
        expected_cgt: "预计CGT: {amount}",
        cgt_reduces_final_return: "资本利得税进一步减少了最终回报。",
        improvement_suggestions: "改善建议：",
        increase_rent: "提高租金: 当前租金可能偏低，考虑市场调研",
        reduce_expenses: "降低费用: 优化运营费用，如保险、维护等",
        adjust_loan: "调整贷款: 考虑更低利率或延长还款期",
        reassess_growth: "重新评估增值: 当前{rate}%增值率可能过于乐观",
        
        // Positive IRR Analysis
        positive_irr_performance: "✅ IRR为正值 - 投资表现分析",
        positive_irr_explanation: "当前IRR为 {irr}%，投资产生正回报。",
        
        // Benchmark Comparison
        excellent_investment: "优秀投资",
        good_investment: "良好投资",
        average_investment: "一般投资",
        below_average_investment: "低于平均投资",
        
        // Selling Recommendations
        selling_recommendation_intro: "根据您的投资假设，以下是最佳出售时机建议：",
        cgt_discount_benefit: "CGT 50%折扣优惠",
        holding_over_12_months: "持有房产超过12个月可享受50% CGT折扣",
        optimal_selling_period: "最佳出售时期",
        years_recommendation: "年是获得最佳税后回报的推荐时期",
        market_considerations: "市场考虑因素",
        consult_professional: "请在做出最终决定前咨询合格的税务和投资专业人士。",
        short_term_holding_risk: "短期持有风险提醒",
        short_term_holding_warning: "您计划持有房产{years}年，这意味着您无法享受50%的资本利得税折扣。建议考虑持有超过12个月以获得税务优惠。",
        good_investment_performance: "投资表现良好",
        moderate_investment_performance: "投资表现一般",
        poor_investment_performance: "投资表现需要改善",
        good_performance_description: "根据您的假设，该投资的年化回报率为{irr}%，表现良好。持有{years}年后出售可以享受50%的CGT折扣，是一个合理的投资期限。",
        moderate_performance_description: "该投资的年化回报率为{irr}%，表现中等。建议考虑调整租金预期或寻找更好的增值潜力区域。",
        poor_performance_description: "该投资的年化回报率仅为{irr}%，可能不如其他投资选择。建议重新评估投资参数或考虑其他投资机会。",
        tax_advantage: "税务优势",
        cgt_discount_benefit_description: "由于持有超过12个月，您可以享受50%的资本利得税折扣，节省税款约{amount}。",
        pre_tax_cash_flow: "税前现金流",
        after_tax_cash_flow: "税后现金流",
        
        // Common
        years: "年",
        year_short: "年",
        aud: "澳元",
        percent: "%",
        yes: "是",
        no: "否",
        
        // Messages
        profile_created: "新方案创建成功",
        profile_saved: "方案保存成功",
        profile_deleted: "方案删除成功",
        example_loaded: "示例数据加载成功",
        data_exported: "数据导出成功",
        data_imported: "数据导入成功",
        invalid_file: "无效的文件格式",
        calculation_complete: "计算完成",
        
        // Validation Messages
        required_field: "此字段为必填项",
        invalid_number: "请输入有效数字",
        positive_number: "请输入正数",
        percentage_range: "请输入0到100之间的百分比"
    }
};

// Language management class
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.init();
    }
    
    init() {
        this.updateLanguageButtons();
        this.translatePage();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('langEn').addEventListener('click', () => this.setLanguage('en'));
        document.getElementById('langZh').addEventListener('click', () => this.setLanguage('zh'));
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        document.title = this.translate('title');
        this.updateLanguageButtons();
        this.translatePage();
    }
    
    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang${this.currentLanguage.charAt(0).toUpperCase() + this.currentLanguage.slice(1)}`).classList.add('active');
    }
    
    translate(key) {
        return translations[this.currentLanguage][key] || translations.en[key] || key;
    }
    
    translatePage() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                // Don't change input values, only placeholders
                return;
            }
            
            element.textContent = translation;
        });
        
        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });
        
        // Translate option values
        document.querySelectorAll('option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            option.textContent = this.translate(key);
        });
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});