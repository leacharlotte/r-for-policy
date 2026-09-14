// Grade the mapped values and the rendered line groups, not one spelling of ggplot().
// R snippets work in both the browser runtime and the native-R regression checks.
export function linePlotCheck({data, x, y, colour, labels = {}, displayed = true}) {
  const quote = JSON.stringify;
  const labelChecks = Object.entries(labels).map(([name, value]) =>
    `identical(p$labels[[${quote(name)}]], ${quote(value)})`).join(' && ');
  return `exists("p", inherits = FALSE) && inherits(p, "ggplot")${displayed ? ' && .plot_count > 0' : ''} && local({
    expected <- ${data}
    expected_values <- data.frame(x = expected[[${quote(x)}]], y = expected[[${quote(y)}]])
    ${colour ? `expected_values$category <- as.character(expected[[${quote(colour)}]])` : ''}
    same_values <- function(actual, target) {
      if (!is.data.frame(actual) || nrow(actual) != nrow(target)) return(FALSE)
      actual <- as.data.frame(actual); target <- as.data.frame(target)
      actual <- actual[do.call(order, actual), , drop = FALSE]
      target <- target[do.call(order, target), , drop = FALSE]
      rownames(actual) <- NULL; rownames(target) <- NULL
      isTRUE(all.equal(actual, target, check.attributes = FALSE, tolerance = 1e-7))
    }
    built <- ggplot2::ggplot_build(p)
    line_indices <- which(vapply(p$layers, function(layer) inherits(layer$geom, "GeomLine"), logical(1)))
    expected_groups <- ${colour ? 'split(expected_values[c("x", "y")], expected_values$category)' : 'list(expected_values)'}
    length(line_indices) > 0 && all(vapply(line_indices, function(i) {
      layer <- p$layers[[i]]
      layer_data <- if (is.function(layer$data)) layer$data(p$data) else if (is.data.frame(layer$data)) layer$data else p$data
      mapping <- if (isFALSE(layer$inherit.aes)) list() else as.list(p$mapping)
      mapping[names(layer$mapping)] <- as.list(layer$mapping)
      if (!is.data.frame(layer_data) || is.null(mapping$x) || is.null(mapping$y)${colour ? ' || is.null(mapping$colour)' : ''}) return(FALSE)
      actual_values <- data.frame(x = rlang::eval_tidy(mapping$x, data = layer_data), y = rlang::eval_tidy(mapping$y, data = layer_data))
      ${colour ? 'actual_values$category <- as.character(rlang::eval_tidy(mapping$colour, data = layer_data))' : ''}
      if (!same_values(actual_values, expected_values)) return(FALSE)
      drawn <- built$data[[i]]
      if (anyNA(drawn[c("x", "y", "group")])) return(FALSE)
      groups <- split(drawn, drawn$group)
      if (length(groups) != length(expected_groups)) return(FALSE)
      ${colour ? 'if (length(unique(drawn$colour)) != length(expected_groups) || any(vapply(groups, function(group) length(unique(group$colour)) != 1L, logical(1)))) return(FALSE)' : ''}
      remaining <- seq_along(expected_groups)
      for (group in groups) {
        matches <- remaining[vapply(expected_groups[remaining], function(target) same_values(group[c("x", "y")], target), logical(1))]
        if (!length(matches)) return(FALSE)
        remaining <- setdiff(remaining, matches[1])
      }
      TRUE
    }, logical(1)))${labelChecks ? ` && ${labelChecks}` : ''}
  })`;
}
