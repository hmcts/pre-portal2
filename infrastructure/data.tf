data "azurerm_monitor_action_group" "action_group" {
  name                = "CriticalAlertsAction"
  resource_group_name = "${var.product}-${var.env}"
}

data "azurerm_application_insights" "app_insights" {
  name                = "pre-${var.env}-appinsights"
  resource_group_name = "${var.product}-${var.env}"
}

