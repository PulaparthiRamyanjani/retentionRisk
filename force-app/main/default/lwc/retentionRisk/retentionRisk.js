import { LightningElement, api } from 'lwc';

import getRetentionRisk from '@salesforce/apex/RetentionRiskController.getRetentionRisk';
import saveRetentionRisk from '@salesforce/apex/RetentionRiskController.saveRetentionRisk';
import getPicklistValues from '@salesforce/apex/RetentionRiskController.getPicklistValues';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RetentionRisk extends LightningElement {

    @api recordId;

    // =====================================================
    // STATE
    // =====================================================

    isLoading = true;

    isEditMode = false;

    retentionRiskId = null;


    // =====================================================
    // FIELD VALUES
    // =====================================================

    rvpQ = '';

    ceaseParticipation = '';

    major = '';

    tnps = '';

    decliningTotalOpenAccounts = '';

    successionPlanIn = '';

    primaryAtRiskReason = '';

    secondaryAtRiskReason = '';

    decliningGdc = '';

    nonResponsive = '';

    advisorEngaging = '';

    imminentDeparture = '';

    forgivableLoans = '';

    changeInTotal = '';

    finalAttriationRiskSummary = '';

    tertiaryAtRiskReason = '';

    riskReasonComment = '';


    // =====================================================
    // PICKLIST OPTIONS
    // =====================================================

    rvpQOptions = [];

    ceaseParticipationOptions = [];

    majorOptions = [];

    tnpsOptions = [];

    decliningTotalOpenAccountsOptions = [];

    successionPlanInOptions = [];

    primaryAtRiskReasonOptions = [];

    secondaryAtRiskReasonOptions = [];

    decliningGdcOptions = [];

    nonResponsiveOptions = [];

    advisorEngagingOptions = [];

    imminentDepartureOptions = [];

    forgivableLoansOptions = [];

    changeInTotalOptions = [];

    finalAttriationRiskSummaryOptions = [];

    tertiaryAtRiskReasonOptions = [];


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    connectedCallback() {

        this.initialize();
    }


    async initialize() {

        this.isLoading = true;

        try {

            await this.loadPicklists();

            await this.loadRetentionRisk();

        } catch (error) {

            this.showToast(
                'Error',
                this.getErrorMessage(error),
                'error'
            );

        } finally {

            this.isLoading = false;
        }
    }


    // =====================================================
    // LOAD PICKLISTS
    // =====================================================

    async loadPicklists() {

        const result =
            await getPicklistValues();


        this.rvpQOptions =
            this.createOptions(
                result.RVP_Q__c
            );


        this.ceaseParticipationOptions =
            this.createOptions(
                result.Cease_Participation__c
            );


        this.majorOptions =
            this.createOptions(
                result.Major__c
            );


        this.tnpsOptions =
            this.createOptions(
                result.TNPS__c
            );


        this.decliningTotalOpenAccountsOptions =
            this.createOptions(
                result.Declining_Total_Open_Accounts__c
            );


        this.successionPlanInOptions =
            this.createOptions(
                result.Succession_Plan_In__c
            );


        this.primaryAtRiskReasonOptions =
            this.createOptions(
                result.Primary_At_Risk_Reason__c
            );


        this.secondaryAtRiskReasonOptions =
            this.createOptions(
                result.Secondary_At_Risk__c
            );


        this.decliningGdcOptions =
            this.createOptions(
                result.Declining_GDC__c
            );


        this.nonResponsiveOptions =
            this.createOptions(
                result.Non_Responsive__c
            );


        this.advisorEngagingOptions =
            this.createOptions(
                result.Advisor_Engaging__c
            );


        this.imminentDepartureOptions =
            this.createOptions(
                result.Imminent_Departure__c
            );


        this.forgivableLoansOptions =
            this.createOptions(
                result.Forgivable_Loans__c
            );


        this.changeInTotalOptions =
            this.createOptions(
                result.Change_In_Total__c
            );


        // IMPORTANT:
        // Exact spelling/API name
        this.finalAttriationRiskSummaryOptions =
            this.createOptions(
                result.Final_Attriation_Risk_Summary__c
            );


        this.tertiaryAtRiskReasonOptions =
            this.createOptions(
                result.Tertiary_At_Risk_Reason__c
            );
    }


    // =====================================================
    // CREATE PICKLIST OPTIONS
    // =====================================================

    createOptions(values) {

        if (!values) {
            return [];
        }

        return values.map(value => ({
            label: value,
            value: value
        }));
    }


    // =====================================================
    // LOAD LATEST RETENTION RISK
    // =====================================================

    async loadRetentionRisk() {

        const result =
            await getRetentionRisk({
                accountId: this.recordId
            });


        if (result) {

            this.retentionRiskId =
                result.Id;


            this.rvpQ =
                result.RVP_Q__c || '';


            this.ceaseParticipation =
                result.Cease_Participation__c || '';


            this.major =
                result.Major__c || '';


            this.tnps =
                result.TNPS__c || '';


            this.decliningTotalOpenAccounts =
                result.Declining_Total_Open_Accounts__c || '';


            this.successionPlanIn =
                result.Succession_Plan_In__c || '';


            this.primaryAtRiskReason =
                result.Primary_At_Risk_Reason__c || '';


            this.secondaryAtRiskReason =
                result.Secondary_At_Risk__c || '';


            this.decliningGdc =
                result.Declining_GDC__c || '';


            this.nonResponsive =
                result.Non_Responsive__c || '';


            this.advisorEngaging =
                result.Advisor_Engaging__c || '';


            this.imminentDeparture =
                result.Imminent_Departure__c || '';


            this.forgivableLoans =
                result.Forgivable_Loans__c || '';


            this.changeInTotal =
                result.Change_In_Total__c || '';


            // IMPORTANT
            this.finalAttriationRiskSummary =
                result.Final_Attriation_Risk_Summary__c || '';


            this.tertiaryAtRiskReason =
                result.Tertiary_At_Risk_Reason__c || '';


            this.riskReasonComment =
                result.Risk_Reason_Comment__c || '';


            // Existing record = VIEW MODE
            this.isEditMode = false;

        } else {

            // No record exists
            this.clearForm();

            // New record = EDIT MODE
            this.isEditMode = true;
        }
    }


    // =====================================================
    // GREEN CHECK
    // =====================================================

    get isGreen() {

        return (
            this.finalAttriationRiskSummary === 'Green'
        );
    }


    // =====================================================
    // NON-GREEN CHECK
    // =====================================================

    get isNonGreen() {

        return (
            this.finalAttriationRiskSummary !== '' &&
            !this.isGreen
        );
    }


    // =====================================================
    // COMMENT VISIBILITY
    // =====================================================

    get showRiskReasonComment() {

        return this.isNonGreen;
    }


    // =====================================================
    // COMMENT REQUIRED
    // =====================================================

    get isReasonRequired() {

        return this.isNonGreen;
    }


    // =====================================================
    // RISK REASON DISABLED
    // =====================================================

    get riskReasonsDisabled() {

        return this.isGreen;
    }


    // =====================================================
    // FINAL SUMMARY CHANGE
    // =====================================================

    handleRiskSummaryChange(event) {

        this.finalAttriationRiskSummary =
            event.detail.value;


        if (this.isGreen) {

            this.primaryAtRiskReason = '';

            this.secondaryAtRiskReason = '';

            this.tertiaryAtRiskReason = '';

            this.riskReasonComment = '';
        }
    }


    // =====================================================
    // GENERIC CHANGE
    // =====================================================

    handleChange(event) {

        const fieldName =
            event.target.name;

        const value =
            event.detail.value;


        switch (fieldName) {

            case 'rvpQ':
                this.rvpQ = value;
                break;

            case 'ceaseParticipation':
                this.ceaseParticipation = value;
                break;

            case 'major':
                this.major = value;
                break;

            case 'tnps':
                this.tnps = value;
                break;

            case 'decliningTotalOpenAccounts':
                this.decliningTotalOpenAccounts = value;
                break;

            case 'successionPlanIn':
                this.successionPlanIn = value;
                break;

            case 'primaryAtRiskReason':
                this.primaryAtRiskReason = value;
                break;

            case 'secondaryAtRiskReason':
                this.secondaryAtRiskReason = value;
                break;

            case 'decliningGdc':
                this.decliningGdc = value;
                break;

            case 'nonResponsive':
                this.nonResponsive = value;
                break;

            case 'advisorEngaging':
                this.advisorEngaging = value;
                break;

            case 'imminentDeparture':
                this.imminentDeparture = value;
                break;

            case 'forgivableLoans':
                this.forgivableLoans = value;
                break;

            case 'changeInTotal':
                this.changeInTotal = value;
                break;

            case 'tertiaryAtRiskReason':
                this.tertiaryAtRiskReason = value;
                break;

            case 'riskReasonComment':
                this.riskReasonComment = value;
                break;

            default:
                break;
        }
    }


    // =====================================================
    // EDIT
    // =====================================================

    handleEdit() {

        this.isEditMode = true;
    }


    // =====================================================
    // CANCEL
    // =====================================================

    async handleCancel() {

        this.isLoading = true;

        try {

            await this.loadRetentionRisk();

        } catch (error) {

            this.showToast(
                'Error',
                this.getErrorMessage(error),
                'error'
            );

        } finally {

            this.isLoading = false;
        }
    }


    // =====================================================
    // SAVE
    // =====================================================

    async handleSave() {

        // -----------------------------------------------
        // Only Risk Reason Comment is required
        // for non-Green values.
        // -----------------------------------------------

        if (this.isReasonRequired) {

            const comment =
                this.template.querySelector(
                    'lightning-textarea'
                );


            if (
                comment &&
                !comment.reportValidity()
            ) {

                return;
            }
        }


        // -----------------------------------------------
        // Green = clear disabled fields
        // -----------------------------------------------

        if (this.isGreen) {

            this.primaryAtRiskReason = '';

            this.secondaryAtRiskReason = '';

            this.tertiaryAtRiskReason = '';

            this.riskReasonComment = '';
        }


        this.isLoading = true;


        try {

            const retentionRisk = {

                Id:
                    this.retentionRiskId,

                Account__c:
                    this.recordId,


                RVP_Q__c:
                    this.rvpQ,

                Cease_Participation__c:
                    this.ceaseParticipation,

                Major__c:
                    this.major,

                TNPS__c:
                    this.tnps,

                Declining_Total_Open_Accounts__c:
                    this.decliningTotalOpenAccounts,

                Succession_Plan_In__c:
                    this.successionPlanIn,


                Primary_At_Risk_Reason__c:
                    this.primaryAtRiskReason,

                Secondary_At_Risk__c:
                    this.secondaryAtRiskReason,


                Declining_GDC__c:
                    this.decliningGdc,

                Non_Responsive__c:
                    this.nonResponsive,

                Advisor_Engaging__c:
                    this.advisorEngaging,

                Imminent_Departure__c:
                    this.imminentDeparture,

                Forgivable_Loans__c:
                    this.forgivableLoans,

                Change_In_Total__c:
                    this.changeInTotal,


                // EXACT API NAME
                Final_Attriation_Risk_Summary__c:
                    this.finalAttriationRiskSummary,


                Tertiary_At_Risk_Reason__c:
                    this.tertiaryAtRiskReason,


                Risk_Reason_Comment__c:
                    this.riskReasonComment
            };


            const result =
                await saveRetentionRisk({

                    accountId:
                        this.recordId,

                    retentionRiskJson:
                        JSON.stringify(
                            retentionRisk
                        )
                });


            this.retentionRiskId =
                result.Id;


            // -------------------------------------------
            // IMPORTANT:
            // Reload latest saved Salesforce record
            // -------------------------------------------

            await this.loadRetentionRisk();


            this.showToast(
                'Success',
                'Retention Risk saved successfully.',
                'success'
            );

        } catch (error) {

            this.showToast(
                'Error',
                this.getErrorMessage(error),
                'error'
            );

        } finally {

            this.isLoading = false;
        }
    }


    // =====================================================
    // DISPLAY VALUES
    // =====================================================

    get rvpQDisplay() {
        return this.rvpQ || '—';
    }

    get ceaseParticipationDisplay() {
        return this.ceaseParticipation || '—';
    }

    get majorDisplay() {
        return this.major || '—';
    }

    get tnpsDisplay() {
        return this.tnps || '—';
    }

    get decliningTotalOpenAccountsDisplay() {
        return this.decliningTotalOpenAccounts || '—';
    }

    get successionPlanInDisplay() {
        return this.successionPlanIn || '—';
    }

    get primaryAtRiskReasonDisplay() {
        return this.primaryAtRiskReason || '—';
    }

    get secondaryAtRiskReasonDisplay() {
        return this.secondaryAtRiskReason || '—';
    }

    get decliningGdcDisplay() {
        return this.decliningGdc || '—';
    }

    get nonResponsiveDisplay() {
        return this.nonResponsive || '—';
    }

    get advisorEngagingDisplay() {
        return this.advisorEngaging || '—';
    }

    get imminentDepartureDisplay() {
        return this.imminentDeparture || '—';
    }

    get forgivableLoansDisplay() {
        return this.forgivableLoans || '—';
    }

    get changeInTotalDisplay() {
        return this.changeInTotal || '—';
    }

    get finalAttriationRiskSummaryDisplay() {
        return this.finalAttriationRiskSummary || '—';
    }

    get tertiaryAtRiskReasonDisplay() {
        return this.tertiaryAtRiskReason || '—';
    }

    get riskReasonCommentDisplay() {
        return this.riskReasonComment || '—';
    }


    // =====================================================
    // CLEAR FORM
    // =====================================================

    clearForm() {

        this.retentionRiskId = null;

        this.rvpQ = '';

        this.ceaseParticipation = '';

        this.major = '';

        this.tnps = '';

        this.decliningTotalOpenAccounts = '';

        this.successionPlanIn = '';

        this.primaryAtRiskReason = '';

        this.secondaryAtRiskReason = '';

        this.decliningGdc = '';

        this.nonResponsive = '';

        this.advisorEngaging = '';

        this.imminentDeparture = '';

        this.forgivableLoans = '';

        this.changeInTotal = '';

        this.finalAttriationRiskSummary = '';

        this.tertiaryAtRiskReason = '';

        this.riskReasonComment = '';
    }


    // =====================================================
    // TOAST
    // =====================================================

    showToast(title, message, variant) {

        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    getErrorMessage(error) {

        if (
            error &&
            error.body &&
            error.body.message
        ) {

            return error.body.message;
        }


        if (
            error &&
            error.message
        ) {

            return error.message;
        }


        return 'An unexpected error occurred.';
    }
}