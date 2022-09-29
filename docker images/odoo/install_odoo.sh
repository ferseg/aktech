# This script prepares the environment for development
git clone --branch 14.0 --depth 1 https://github.com/odoo/odoo.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-budgeting.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-closing.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-financial-reporting.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-financial-tools.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-invoicing.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-payment.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/account-reconcile.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/bank-payment.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/bank-statement-import.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/connector.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/contract.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/crm.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/event.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/helpdesk.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/hr.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/hr-expense.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/hr-holidays.git
git clone --branch 14.0 --depth 1 https://github.com/akurey/l10n_cr.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/mis-builder.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/partner-contact.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/payroll
git clone --branch 14.0 --depth 1 https://github.com/OCA/product-attribute.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/project.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/queue.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/reporting-engine.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/rest-framework.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/sale-workflow.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/server-tools.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/server-ux.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/timesheet.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/web.git
git clone --branch 14.0 --depth 1 https://github.com/OCA/website.git


cp -R AK-Odoo/Utilities/vscode odoo/.vscode .
cp AK-Odoo/Utilities/odoo14.code-workspace .
