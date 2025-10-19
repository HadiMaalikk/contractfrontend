# report_generator.py

from jinja2 import Template
from datetime import datetime
import json

def generate_html_report(comparison_result: dict, filename: str = "comparison_report.html") -> str:
    template_str = """
    <html>
    <head>
        <title>Contract Comparison Report</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            h1, h2 { color: #2c3e50; }
            pre { background: #f4f4f4; padding: 10px; border-left: 4px solid #ccc; }
            .section { margin-bottom: 30px; }
            .diff-item { margin-bottom: 1em; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .added { background-color: #d4f8d4; }
            .removed { background-color: #f8d4d4; }
            .replaced { background-color: #f8f3d4; }
        </style>
    </head>
    <body>
        <h1>Contract Comparison Report</h1>
        <p><strong>Generated:</strong> {{ timestamp }}</p>

        <div class="section">
            <h2>Semantic Text Differences (AI-Enhanced)</h2>
            {% if diff_semantic %}
                {% for item in diff_semantic %}
                    <div class="diff-item">
                        <b>Original Sentence:</b> {{ item.original_content }}<br>
                        <b>Matched Sentence:</b> {{ item.modified_content }}<br>
                        <b>Similarity Score:</b> {{ item.confidence }}<br>
                        <b>Importance:</b> {{ item.importance }}<br>
                        {% if item.note %}<b>Note:</b> {{ item.note }}<br>{% endif %}
                    </div>
                {% endfor %}
            {% else %}
                <pre>No semantic differences found.</pre>
            {% endif %}
        </div>

        <div class="section">
            <h2>Word-Level Differences</h2>
            {% if word_diff %}
                {% for item in word_diff %}
                    <div class="diff-item {{ item.type }}">
                        {% if item.type == 'replaced' %}
                            <b>Replaced:</b> "{{ item.old_text }}" → "{{ item.new_text }}"
                        {% else %}
                            <b>{{ item.type.capitalize() }}:</b> "{{ item.text }}"
                        {% endif %}
                    </div>
                {% endfor %}
            {% else %}
                <pre>No word-level differences found.</pre>
            {% endif %}
        </div>

        <div class="section">
            <h2>Grammar Issues - Document 1</h2>
            <ul>
                {% for issue in grammar1 %}
                    <li><strong>{{ issue.message }}</strong> — Suggestions: {{ issue.suggestions }}</li>
                {% endfor %}
            </ul>
        </div>

        <div class="section">
            <h2>Grammar Issues - Document 2</h2>
            <ul>
                {% for issue in grammar2 %}
                    <li><strong>{{ issue.message }}</strong> — Suggestions: {{ issue.suggestions }}</li>
                {% endfor %}
            </ul>
        </div>

        <div class="section">
            <h2>Formatting Differences</h2>
            <pre>{{ formatting_diff | tojson(indent=2) }}</pre>
        </div>

        <div class="section">
            <h2>Visual Comparison</h2>
            <pre>{{ visual_comparison | tojson(indent=2) }}</pre>
        </div>

        <div class="section">
            <h2>Date References Comparison</h2>
            <pre>{{ date_comparison | tojson(indent=2) }}</pre>
        </div>
    </body>
    </html>
    """

    template = Template(template_str)
    html = template.render(
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        diff_semantic=comparison_result.get("text_diff_semantic", []),
        word_diff=comparison_result.get("text_diff_structured", []),
        grammar1=comparison_result.get("grammar_issues_doc1", []),
        grammar2=comparison_result.get("grammar_issues_doc2", []),
        formatting_diff=comparison_result.get("formatting_diff", {}),
        visual_comparison=comparison_result.get("visual_comparison", {}),
        date_comparison=comparison_result.get("date_comparison", {})
    )

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)

    return filename
