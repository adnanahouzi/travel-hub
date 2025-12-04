package com.travelhub.connectors.nuitee.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class SentimentAnalysis {
    private List<String> cons;
    private List<String> pros;
    private List<SentimentCategory> categories;

    public List<String> getCons() {
        return cons;
    }

    public void setCons(List<String> cons) {
        this.cons = cons;
    }

    public List<String> getPros() {
        return pros;
    }

    public void setPros(List<String> pros) {
        this.pros = pros;
    }

    public List<SentimentCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<SentimentCategory> categories) {
        this.categories = categories;
    }
}

